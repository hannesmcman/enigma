import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  View,
  ScrollView
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  Item,
  Input,
  Container,
  Content,
  Footer,
  FooterTab
} from "native-base";
import { Circle } from "../components/circle";
import { MessageItem } from "../components/message";

export class ChatView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetUser: null
    };
  }

  onSendMessage = e => {
    // (1)
    console.log("Triggered");
    if (this.state.targetUser) {
      this.props.onSendMessage(e.nativeEvent.text, this.state.targetUser);
      this.input._root.clear();
    } else {
      console.log("No target user selected");
    }
  };

  onInitiateMessage = user => {
    console.log(user);
    this.input._root.focus();
    this.setState(() => ({ targetUser: user }));
  };

  _keyExtractor = (item, index) => index.toString();

  render() {
    // (2)
    const { users } = this.props;

    const userCircles = users.map(user => (
      <Circle
        key={user.name}
        onPress={() => this.onInitiateMessage(user)}
        text={user.name}
      />
    ));

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={64}
      >
        <View style={styles.userWindow}>
          <ScrollView horizontal>{userCircles}</ScrollView>
        </View>
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
    console.log(this.props.privateKey);

    if (action == "join") {
      return <Text style={styles.joinPart}>{name} has joined</Text>;
    } else if (action == "part") {
      return <Text style={styles.joinPart}>{name} has left</Text>;
    } else if (action == "message") {
      return (
        <MessageItem
          message={item.message}
          name={name}
          privateKey={this.props.privateKey}
        />
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "flex-end"
  },
  chatArea: {
    flex: 0.8,
    flexDirection: "column"
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
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    backgroundColor: "#00BCD4",
    margin: 10,
    marginRight: 5,
    justifyContent: "center"
  },
  circleText: {
    textAlign: "center",
    fontSize: 15
  },
  userWindow: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray"
    // height: 90,
  }
});
