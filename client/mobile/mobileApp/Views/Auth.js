'use strict';

var React = require('react-native');
var globalStyles = require('../Stylesheet');
var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

var styles = StyleSheet.create({
  container: {
    marginTop: 65,
    flexDirection :'column', 
    height: 580,
  },
  top: {
    flex: 1,
  },
  bot: {
    flex: 3,
    justifyContent: 'flex-end'

  },

});

class Auth extends Component {
  render() {
      return (
        <View style={styles.container}>
          <View style={styles.top}>
            <Text style={globalStyles.prompt}>WorkWhere</Text>
          </View>
          <View style={styles.bot}>
          <TouchableHighlight style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Sign Up</Text>
          </TouchableHighlight>
          <TouchableHighlight style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Log In</Text>
          </TouchableHighlight>

          </View>
        </View>
        );
  }
}

module.exports = Auth;