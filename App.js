import React from 'react';
import Login from './Login';
import ChatClient from './ChatClient';

export default class App extends React.Component { // (1)
  constructor(props) {
    super(props); // (2)
    this.handleSubmitName = this.onSubmitName.bind(this); // (3)
    this.state = { // (4)
      hasName: false
    };
  }

  onSubmitName(e) { // (5)
    const name = e.nativeEvent.text;
    this.setState({
      name,
      hasName: true
    });
  }

  render() {
    if (this.state.hasName) {
      return (
        <ChatClient name={ this.state.name } />
      );
    } else {
      return (
        <Login onSubmitName={ this.handleSubmitName } />
      );
    }
  }
}
