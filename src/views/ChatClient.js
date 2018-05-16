import React from "react";
import Pusher from "pusher-js/react-native";
import { StyleSheet, Text, KeyboardAvoidingView, View } from "react-native";
import { ChatView } from "./ChatView";
import { connect } from "react-redux";
import { makeKey } from "../flux/reducers/app";
import Spinner from "react-native-loading-spinner-overlay";
import pusherConfig from "../../pusher.json";

class UnconnectedChatClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loading: false
    };
    this.pusher = new Pusher(pusherConfig.key, pusherConfig);

    this.chatChannel = this.pusher.subscribe("chat_channel");
    this.chatChannel.bind("pusher:subscription_succeeded", () => {
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
    });
  }

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
    const messages = this.state.messages.slice();
    messages.push({ action: "message", name: name, message: message });
    this.setState({
      messages: messages
    });
  }

  componentDidMount() {
    fetch(`${pusherConfig.restServer}/users/${this.props.name}`, {
      method: "PUT"
    });
    this.setState(() => ({ loading: true }));
    setTimeout(() => {
      // this.props.makeKey();
      this.setState(() => ({ loading: false }));
    }, 500);
  }

  componentWillUnmount() {
    fetch(`${pusherConfig.restServer}/users/${this.props.name}`, {
      method: "DELETE"
    });
  }

  handleSendMessage = text => {
    console.log("SENDING MESSAGE");
    const payload = {
      message: text
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
    const { messages, loading } = this.state;
    console.log(messages, loading);
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
            onSendMessage={this.handleSendMessage}
          />
        )}
      </View>
    );
    return <View />;
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
