import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Item, Input, Container, Content } from "native-base";

export class ChatView extends React.Component {
  constructor(props) {
    super(props);
  }

  onSendMessage = e => {
    // (1)
    this.props.onSendMessage(e.nativeEvent.text);
    // this.refs.input.clear();
  };

  _keyExtractor = (item, index) => index.toString();

  render() {
    // (2)
    return (
      <Container>
        <Content>
          <FlatList
            data={this.props.messages}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
            styles={styles.messages}
          />

          <Item rounded style={styles.input}>
            <Input
              onSubmitEditing={this.onSendMessage}
              placeholder="I love algorithms"
              ref={ref => {
                this.refs.input = ref;
              }}
            />
          </Item>
        </Content>
      </Container>
    );
  }

  renderItem({ item }) {
    // (3)
    const action = item.action;
    const name = item.name;

    if (action == "join") {
      return <Text style={styles.joinPart}>{name} has joined</Text>;
    } else if (action == "part") {
      return <Text style={styles.joinPart}>{name} has left</Text>;
    } else if (action == "message") {
      return (
        <Text>
          {name}: {item.message}
        </Text>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: getStatusBarHeight()
  },
  messages: {
    alignSelf: "stretch"
  },
  input: {
    alignSelf: "flex-end",
    backgroundColor: "gray"
  },
  joinPart: {
    fontStyle: "italic"
  }
});
