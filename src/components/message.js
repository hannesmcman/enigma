import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { decryptRSA } from "rsa-encryption-js";

export class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      encrypted: false,
      message: this.props.message,
      decryptedMessage: ""
    };
  }

  componentDidMount() {
    const decrypted = decryptRSA(this.props.message, this.props.privateKey);
    this.setState(() => ({ decryptedMessage: decrypted }));
  }

  onPress = () => {
    if (this.state.encrypted) {
      this.setState(() => ({
        message: this.props.message,
        encrypted: false
      }));
    } else {
      this.setState(() => ({
        message: this.state.decryptedMessage,
        encrypted: true
      }));
    }
  };

  render() {
    const { name } = this.props;
    const { encrypted, message } = this.state;
    return (
      <TouchableOpacity onPress={this.onPress}>
        <Text>
          {name}: {message}
        </Text>
      </TouchableOpacity>
    );
  }
}
