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

Pusher.logToConsole = true;

const chatRoom = "presence-chat";

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
    const fullConfig = {
      ...pusherConfig,
      authEndpoint: `${pusherConfig.restServer}/pusher/auth`,
      auth: {
        params: {
          name: this.props.name,
          publicKey: JSON.stringify(this.props.RSAkey.public)
        }
      }
    };
    this.pusher = new Pusher(pusherConfig.key, fullConfig);
    this.chatChannel = this.pusher.subscribe("presence-chat");
    this.chatChannel.bind("pusher:member_added", member => {
      // for example:
      const currentMembers = this.state.users;
      const updatedMembers = [...currentMembers, member.info];
      this.setState(() => ({ users: updatedMembers }));
    });

    this.chatChannel.bind("pusher:member_removed", member => {
      // for example:
      let currentMembers = this.state.users;
      remove(currentMembers, user => user.name === member.info.name);
      this.setState(() => ({ users: currentMembers }));
    });

    this.chatChannel.bind("pusher:subscription_error", status => {
      console.log(status);
    });

    this.chatChannel.bind("pusher:subscription_succeeded", () => {
      this.chatChannel.bind("join", data => {
        this.handleJoin(data.name);
      });
      this.chatChannel.bind("part", data => {
        this.handlePart(data.name);
      });
      this.chatChannel.bind("message", data => {
        this.handleMessage(data.name, data.message);
      });
      let users = [];
      this.chatChannel.members.each(function(member) {
        const userInfo = member.info;
        users = [...users, userInfo];
      });
      this.setState(() => ({ users: users }));
    });
  };

  handleJoin = name => {
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
    const messages = this.state.messages.slice();
    messages.push({ action: "message", name: name, message: message });
    this.setState({
      messages: messages
    });
  }

  componentDidMount() {
    fetch(`${pusherConfig.restServer}/users/${this.props.name}/${chatRoom}`, {
      method: "PUT"
    }).then(() => {
      this.setState(() => ({ loading: true }));
      this.props.makeKey();
      this.setUpServer();
      this.setState(() => ({ loading: false }));
    });
  }

  componentWillUnmount() {
    fetch(`${pusherConfig.restServer}/users/${this.props.name}/${chatRoom}`, {
      method: "DELETE"
    });
    this.chatChannel.unbind();
    this.chatChannel = this.pusher.unsubscribe("presence-chat");
  }

  handleSendMessage = (text, targetUser) => {
    const publicKey = JSON.parse(targetUser.publicKey);
    const encryptedMessage = encryptRSA(text, publicKey);
    const payload = {
      message: encryptedMessage
    };
    fetch(
      `${pusherConfig.restServer}/users/${
        this.props.name
      }/messages/${chatRoom}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
  };

  render() {
    const { messages, loading, users } = this.state;
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
