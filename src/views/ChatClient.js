import React from "react";
import Pusher from "pusher-js/react-native";
import { StyleSheet, Text, KeyboardAvoidingView, View } from "react-native";
import { ChatView } from "./ChatView";
import { connect } from "react-redux";
import { makeKey } from "../flux/reducers/app";
import Spinner from "react-native-loading-spinner-overlay";
import pusherConfig from "../../pusher.json";
import { encryptRSA } from "rsa-encryption-js";
import remove from "lodash/remove";

class UnconnectedChatClient extends React.Component {
  static navigationOptions = {
    title: "RSA Forum"
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      users: [],
      loading: false
    };
  }

  setUpServer = () => {
    console.log(JSON.stringify(this.props.RSAkey.public));
    this.pusher = new Pusher(pusherConfig.key, {
      ...pusherConfig,
      auth: {
        params: {
          name: this.props.name,
          publicKey: JSON.stringify(this.props.RSAkey.public)
        }
      }
    });
    this.chatChannel = this.pusher.subscribe("presence-chat_channel");

    this.chatChannel.bind("pusher:member_added", member => {
      // for example:
      console.log("MEMBER ADDED: " + member.info.name);
      const currentMembers = this.state.users;
      const updatedMembers = [...currentMembers, member.info];
      this.setState(() => ({ users: updatedMembers }));
    });

    this.chatChannel.bind("pusher:member_removed", member => {
      // for example:
      console.log("MEMBER REMOVED: " + member.info.name);
      let currentMembers = this.state.users;
      remove(currentMembers, user => user.name === member.info.name);
      this.setState(() => ({ users: currentMembers }));
    });

    this.chatChannel.bind("pusher:subscription_error", status => {
      console.log(status);
    });

    this.chatChannel.bind("pusher:subscription_succeeded", () => {
      console.log("SUBSCRIBED SUCCESSFULLY");
      this.chatChannel.bind("join", data => {
        console.log("WORKING");
        this.handleJoin(data.name);
      });
      this.chatChannel.bind("part", data => {
        this.handlePart(data.name);
      });
      this.chatChannel.bind("message", data => {
        this.handleMessage(data.name, data.message);
      });
      console.log(this.chatChannel);
      let users = [];
      this.chatChannel.members.each(function(member) {
        const userInfo = member.info;
        users = [...users, userInfo];
      });
      this.setState(() => ({ users: users }));
      console.log(this.state.users);
    });
  };

  handleJoin = name => {
    console.log("JOINED");
    const messages = this.state.messages.slice();
    messages.push({ action: "join", name: name });
    this.setState({
      messages: messages
    });
  };

  handlePart(name) {
    const messages = this.state.messages.slice();
    messages.push({ action: "part", name: name });
    this.setState({
      messages: messages
    });
  }

  handleMessage(name, message) {
    console.log("message received");
    const messages = this.state.messages.slice();
    messages.push({ action: "message", name: name, message: message });
    this.setState({
      messages: messages
    });
  }

  componentDidMount() {
    fetch(`${pusherConfig.restServer}/users/${this.props.name}`, {
      method: "PUT"
    }).then(() => {
      this.setState(() => ({ loading: true }));
      this.props.makeKey();
      this.setUpServer();
      this.setState(() => ({ loading: false }));
    });
  }

  componentWillUnmount() {
    fetch(`${pusherConfig.restServer}/users/${this.props.name}`, {
      method: "DELETE"
    });
    this.chatChannel.unbind();
    this.chatChannel = this.pusher.unsubscribe("presence-chat_channel");
  }

  handleSendMessage = (text, targetUser) => {
    console.log(`Sending message to ${targetUser.name}`);
    // const key = JSON.parse(targetUser.publicKey)
    console.log(JSON.stringify(targetUser.publicKey));
    const publicKey = JSON.parse(targetUser.publicKey);
    console.log(publicKey);
    const encryptedMessage = encryptRSA(text, publicKey);
    console.log(targetUser.publicKey);
    console.log(encryptedMessage);
    const payload = {
      message: encryptedMessage
    };
    fetch(`${pusherConfig.restServer}/users/${this.props.name}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  };

  render() {
    const { messages, loading, users } = this.state;
    console.log("RENDER: " + users);
    return (
      <View style={styles.container}>
        {loading ? (
          <Spinner
            visible={true}
            style={styles.spinner}
            textContent="Generating RSA Key"
          />
        ) : (
          <ChatView
            messages={messages}
            onMessagePress={this.decryptMessage}
            onSendMessage={this.handleSendMessage}
            privateKey={this.props.RSAkey ? this.props.RSAkey.private : null}
            users={users}
          />
        )}
      </View>
    );
  }
}

function mapState(state) {
  return {
    name: state.app ? state.app.name : "",
    RSAkey: state.app ? state.app.RSAkey : null
  };
}

function mapDispatch(dispatch) {
  return {
    startSession: name => dispatch(startSession(name)),
    makeKey: () => dispatch(makeKey())
  };
}

export const ChatClient = connect(mapState, mapDispatch)(UnconnectedChatClient);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  spinner: {
    flex: 1
  }
});
