import React from 'react';
import { StyleSheet, Text, TextInput, KeyboardAvoidingView } from 'react-native';

export default class Login extends React.Component { // (1)
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding"> // (2)
        <Text>Enter the name to connect as:</Text> // (3)
        <TextInput autoCapitalize="none" // (4)
           autoCorrect={false}
           autoFocus
           keyboardType="default"
           maxLength={ 20 }
           placeholder="Username"
           returnKeyType="done"
           enablesReturnKeyAutomatically
           style={styles.username}
           onSubmitEditing={this.props.onSubmitName}
           />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({ // (5)
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  username: {
    alignSelf: 'stretch',
    textAlign: 'center'
  }
});
