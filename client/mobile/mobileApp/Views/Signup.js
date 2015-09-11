'use strict';

var React = require('react-native');
var Default = require('./Default');
var Login = require('./Login');

var {
  ActivityIndicatorIOS,
  AppRegistry,
  AsyncStorage,
  Component,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

var reqBody = {'firstName': '', 'lastName': '', 'email': '', 'password': ''};

var obj = {  
  method: 'POST',
  headers: {
     'Content-Type': 'application/json',
   },
  body: JSON.stringify({'firstName': null, 'lastName': null, 'email': null, 'password': null})
}

var Signup =  React.createClass({
  /**
   * Method to be run upon initialization
   * returns a state object with:
   * isLoading, errorText, firstNameInputStyle, lastNameInputStyle, 
   * emailInput Style, passwordInptuStyle
  */
  getInitialState: function() {
    return {
      isLoading: false,
      errorText: '',
      firstNameInputStyle: styles.textInput,
      lastNameInputStyle: styles.textInput,
      emailInputStyle: styles.textInput,
      passwordInputStyle: styles.textInput,
    };
  },
  /**
   * Method to render a view with name, email, and password fields
   * along with a send and a redirect button
  */
  render: function(){
    var spacer = <View style={styles.spacer}/>;
    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
          hidden='true'
          size='large'
          color='#ffffff'/> ) :
      ( <View/>);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.wrapper}>
          <View style={styles.header}>
            <Text style={styles.titleText}>Rectangle</Text>
          </View>
          <TextInput
              style={this.state.firstNameInputStyle}
              placeholder='Name'
              autoCapitalize={true}
              autoCorrect={false}
              clearButtonMode={'while-editing'}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'firstName')
              }/>
          <TextInput
              style={this.state.lastNameInputStyle}
              placeholder='Last'
              autoCapitalize={true}
              autoCorrect={false}
              clearButtonMode={'while-editing'}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'lastName')
              }/>
          <TextInput
              style={this.state.emailInputStyle}
              autoCapitalize={false}
              autoCorrect={false}
              keyboardType='email-address'
              placeholder='Email'
              clearButtonMode={'while-editing'}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'email')
              }/>
          <TextInput
              style={this.state.passwordInputStyle}
              placeholder='Password'
              clearButtonMode={'while-editing'}
              secureTextEntry={true}
              onChange={(event) => 
                this.updateProp(event.nativeEvent.text,'password')
              }/>
          
          <View style={styles.footer}>
            <View style={styles.moveRight}>
            </View>
            <TouchableHighlight style={styles.button}
                 onPress={() => this.onSend()}
                 underlayColor='rgba(61,125,168,0.1)'>
               <Text style={styles.buttonText}>
                  Sign Up
               </Text>
             </TouchableHighlight>
             
             <TouchableHighlight
               style={styles.redirectButton}
               onPress={() => this.otherAuth()}
               underlayColor='rgba(61,125,168,0.1)'>
               <Text style = {styles.redirectButtonText}>
                 Sign in instead!
               </Text>
             </TouchableHighlight>
          </View>
          <View style={styles.errContainer}>
            <Text style={styles.errorText}>{this.state.errorText}</Text>
              {spinner}
          </View>
          {spacer}
          
        </ScrollView>
      </View>
    );
  },
  /**
   * Method to redirec the user to the other auth page
  */
  otherAuth: function() {
    this.props.navigator.replace({
      title: '',
      component: Login
    });
  },
  /**
   * Method that updates the response object on changes
   * @param {string} 'text': the text that is updated
   * @param {string} 'prop': the property that is updated
  */
  updateProp: function(text,prop) {
    reqBody[prop] = text;
    obj.body = JSON.stringify(reqBody);
    this.setState((state) => {
      return {
        curText: text
      };
    });
  },
  /**
   * Method that handles the HTTP response with validation and AsyncStorage
   * @param {object} 'response': the response from the HTTP request
  */
  _responseHandler: function(response){
    if(response.message){
      AsyncStorage.setItem('userEmail', response.message)
      .then(() => {
        console.log('successfully saved user email:', response.message, 'Signup.js', 97);
        this.props.navigator.replace({
          title: '',
          component: Default
        });
      })
    } else if (response.error){
      this.state.emailInputStyle = styles.wrongInput;
      this.state.errorText = response.error;
    }
    this.setState((state) => {
      return {
        isLoading: false
      };
    });
  },
  /**
   * Method that creates the HTTP request to the server
  */
  onSend: function() {
    console.log(reqBody,'heeeey!')
    if(reqBody.firstName === '' || reqBody.lastName === '' || reqBody.email === '' || reqBody.password === ''){
      this.state.errorText = 'Please leave no blank fields';

        if(reqBody.firstName === ''){
          this.setState((state) => {
            return {
              firstNameInputStyle: styles.wrongInput
            };
          });
        } else {
          this.setState((state) => {
            return {
              firstNameInputStyle: styles.textInput
            };
          });
        }
        if(reqBody.lastName === ''){
          this.setState((state) => {
            return {
              lastNameInputStyle: styles.wrongInput
            };
          });
        } else {
          this.setState((state) => {
            return {
              lastNameInputStyle: styles.textInput
            };
          });
        }
        if(reqBody.email === ''){
          this.setState((state) => {
            return {
              emailInputStyle: styles.wrongInput
            };
          });
        } else {
          this.setState((state) => {
            return {
              emailInputStyle: styles.textInput
            };
          });
        }
        if(reqBody.password === ''){
          this.setState((state) => {
            return {
              passwordInputStyle: styles.wrongInput
            };
          });
        } else {
          this.setState((state) => {
            return {
              passwordInputStyle: styles.textInput
            };
          });
        }



    } else {
      this.setState((state) => {
        return {
          isLoading: true
        };
      });
      fetch('https://tranquil-earth-7083.herokuapp.com/users/signup', obj)  
      .then((res) => res.json())
      .then((resJson) => {
        this._responseHandler(resJson)
        resJson
      })
      .catch((err) => {
        console.log(new Error(err));
      });
    }
  }
}); 

var styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 15,
    padding: 10,
    backgroundColor: 'rgba(61,125,168,0.3)',
    borderColor: '#1B374A',
    borderWidth: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#1B374A',
  },
  containerBox: {
    flex: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#1B374A',
    margin: 0,
    marginVertical: 0,
    overflow: 'hidden',
  },
  errContainer: {
    alignItems: 'center',
  },
  errorText: {
    paddingBottom:20,
    color:'#d5d5d5',
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1B374A',
    justifyContent: 'flex-end'
  },
  header: {
    backgroundColor: '#1B374A',
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveRight: {
    flex: 2,

  },
  redirectButton: {
    flex: 1,
    margin: 15,
    padding: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  redirectButtonText: {
    fontSize: 16,
    color: '#ffffff',
    alignSelf: 'center'
  },
  spacer:{
    paddingTop: 150,
    backgroundColor: '#1B374A'
  },
  textInput: {
    height: 36,
    paddingLeft: 10,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 18,
    borderWidth: 0.4,
    borderColor: '#d6d7da',
    // borderRadius: 2,
    backgroundColor: '#ffffff',
    color: '#404040'
  },
  titleText: {
    padding: 24,
    color: 'white',
    fontSize: 24,
    fontWeight: '900'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column'
  },
   wrongInput:{
    height: 36,
    paddingLeft: 10,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 18,
    borderWidth: 0.6,
    borderColor: 'red',
    // borderRadius: 2,
    backgroundColor: '#ffffff',
    color: '#404040'
  },
});

module.exports = Signup;

