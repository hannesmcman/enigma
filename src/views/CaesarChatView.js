import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView
} from "react-native";
import { Item, Input } from "native-base";
import { CaesarMessageItem } from "../components/caesarmessage";

export class CaesarChatView extends React.Component {
  constructor(props) {
    super(props);

    this.handleSendMessage = this.onSendMessage.bind(this);
  }

  onSendMessage = e => {
    this.props.onSendMessage(e.nativeEvent.text);
    this.input._root.clear();
  };

  _keyExtractor = (item, index) => index.toString();

  render() {
    // (2)
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={64}
      >
        <FlatList
          data={this.props.messages}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
          styles={styles.messages}
        />
        <Item style={styles.inputContainer}>
          <Input
            onSubmitEditing={this.onSendMessage}
            placeholder="I love algorithms"
            ref={ref => (this.input = ref)}
            style={styles.input}
          />
        </Item>
      </KeyboardAvoidingView>
    );
  }

  renderItem = ({ item }) => {
    // (3)
    const action = item.action;
    const name = item.name;

    if (action == "join") {
      return <Text style={styles.joinPart}>{name} has joined</Text>;
    } else if (action == "part") {
      return <Text style={styles.joinPart}>{name} has left</Text>;
    } else if (action == "message") {
      return <CaesarMessageItem message={item.message} name={name} />;
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "flex-end"
  },
  messages: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "flex-end"
  },
  inputContainer: {
    alignSelf: "flex-end"
  },
  input: {
    borderTopWidth: 0.5,
    borderTopColor: "gray"
  },
  joinPart: {
    fontStyle: "italic"
  }
});
