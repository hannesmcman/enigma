import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Button from 'apsl-react-native-button'
import {startSession} from '../flux/reducers/app'
import {connect} from 'react-redux'

class LoginView extends React.Component {

  static navigationOptions = {
    title: 'Login',
  }

  login = (e) => {
    const name = e.nativeEvent.text;
    console.log(name)
    this.props.startSession(name)
  }

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
        <Button
          onPress={this.login}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Enter the Chat Room</Text>
        </Button>
      </KeyboardAvoidingView>
    );
  }
}

function mapState(state) {
	return {
		username: state.app ? state.app.username : '',
	}
}

function mapDispatch(dispatch) {
	return {
		startSession: (username) =>
			dispatch(startSession(username)),
	}
}

export const Login = connect(mapState, mapDispatch)(LoginView)

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    width: 200,
    height: 50,
    marginTop: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
  },
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
    fontSize: 20,
  },
});
