import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { startSession } from "../flux/reducers/app";
import { connect } from "react-redux";
import { Button, Input, Container, Item, Content } from "native-base";

class LoginView extends React.Component {
  static navigationOptions = {
    title: "Login"
  };

  enterRSAForum = () => {
    const name = this.input._root._lastNativeText;
    this.props.startSession(name);
    this.props.navigation.navigate("ChatClient");
  };

  enterCaesarForum = () => {
    const name = this.input._root._lastNativeText;
    this.props.startSession(name);
    this.props.navigation.navigate("CaesarChatClient");
  };

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <Item style={styles.inputContainer}>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Username"
              ref={ref => (this.input = ref)}
            />
          </Item>
          <Button primary onPress={this.enterRSAForum} style={styles.button}>
            <Text> Enter RSA Forum </Text>
          </Button>
          <Button success onPress={this.enterCaesarForum} style={styles.button}>
            <Text> Enter Caesar Forum </Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

function mapState(state) {
  return {
    name: state.app ? state.app.name : ""
  };
}

function mapDispatch(dispatch) {
  return {
    startSession: name => dispatch(startSession(name))
  };
}

export const Login = connect(mapState, mapDispatch)(LoginView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  inputContainer: {
    width: 300
  },
  button: {
    margin: 10,
    padding: 10,
    alignSelf: "center"
  }
});
