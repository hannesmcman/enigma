import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { startSession } from "../flux/reducers/app";
import { connect } from "react-redux";

class LoginView extends React.Component {
  static navigationOptions = {
    title: "Login"
  };

  login = e => {
    const name = e.nativeEvent.text;
    console.log(name);
    this.props.startSession(name);
    this.props.navigation.navigate("ChatClient");
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          keyboardType="default"
          maxLength={20}
          placeholder="Username"
          returnKeyType="done"
          enablesReturnKeyAutomatically
          style={styles.username}
          onSubmitEditing={this.login}
        />
      </KeyboardAvoidingView>
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
  username: {
    alignSelf: "center",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
    height: 50,
    fontSize: 20
  }
});
