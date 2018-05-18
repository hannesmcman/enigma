import React from "react";
import Pusher from "pusher-js/react-native";
import { StyleSheet, Text, KeyboardAvoidingView } from "react-native";
import { CaesarChatView } from "./";
import { connect } from "react-redux";
import { randomEncryption } from "ceasarsshift";
import pusherConfig from "../../pusher.json";

Pusher.logToConsole = true;

const chatRoom = "caesar_channel";

export class UnconnectedCaesarChatClient extends React.Component {
  static navigationOptions = {
    title: "Caesar Shift Forum"
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  setUpServer = () => {
    this.pusher = new Pusher(pusherConfig.key, pusherConfig);
    this.chatChannel = this.pusher.subscribe("caesar_channel");
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
    });
  };

  handleJoin = name => {
    const messages = this.state.messages.slice();
    messages.push({ action: "join", name: name });
    this.setState({
      messages: messages
    });
  };

  handlePart = name => {
    const messages = this.state.messages.slice();
    messages.push({ action: "part", name: name });
    this.setState({
      messages: messages
    });
  };

  handleMessage = (name, message) => {
    const messages = this.state.messages.slice();
    messages.push({ action: "message", name: name, message: message });
    this.setState({
      messages: messages
    });
  };

  componentDidMount() {
    fetch(`${pusherConfig.restServer}/users/${this.props.name}/${chatRoom}`, {
      method: "PUT"
    }).then(() => this.setUpServer());
  }

  componentWillUnmount() {
    fetch(`${pusherConfig.restServer}/users/${this.props.name}/${chatRoom}`, {
      method: "DELETE"
    }).then(() => this.chatChannel.unbind());
  }

  handleSendMessage = text => {
    const encryptedMessage = randomEncryption(text);
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
    const messages = this.state.messages;

    return (
      <CaesarChatView
        messages={messages}
        onSendMessage={this.handleSendMessage}
      />
    );
  }
}

function mapState(state) {
  return {
    name: state.app ? state.app.name : ""
  };
}

export const CaesarChatClient = connect(mapState)(UnconnectedCaesarChatClient);
