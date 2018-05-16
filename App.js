// import React from "react";
// import {Login, ChatClient} from './src/views'
//
// export default class App extends React.Component {
//   // (1)
//   constructor(props) {
//     super(props); // (2)
//     this.state = {
//       // (4)
//       hasName: false
//     };
//   }
//
//   handleSubmitName = (e) => {
//     // (5)
//     const name = e.nativeEvent.text;
//     console.log(name);
//     this.setState(() => ({
//       name,
//       hasName: true
//     }));
//   }
//
//   render() {
//     if (this.state.hasName) {
//       return <ChatClient name={this.state.name} />;
//     } else {
//       return <Login onSubmitName={this.handleSubmitName} />;
//     }
//   }
// }
import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { makeStore, initRedux } from './src/flux';
import AppWithNavigationState from './src/navigation';

const store = makeStore()
// initRedux(store)

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
