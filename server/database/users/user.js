/**
 * @file Creates and adds functionality to the User model
*/

var db = require('../config');
var Card = require('../cards/card');
var Connection = require('../connections/connection');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

/**
 * @model of a user in our postgres database
*/
var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  cards: function() {
    // return this.hasMany(Card);
     return this.belongsToMany(Card).through(Connection);
  },

  /**
   * Method: when a user is saved into the database, it 
   * calls hashPassword in order to save the hashed password
  */
  initialize: function(){
    this.on('creating', this.hashPassword);
  },

  /**
   * Method: compares cleartext password with saved, hashed password.
   * @param {string} the cleartext, attempted password
   * returns a promise
  */
  comparePassword: function(attemptedPassword) {
    return bcrypt.compareAsync(attemptedPassword, this.get('password'))
    .then(function(isMatch) {
      return isMatch;
    })
    .catch(function(err) {
      console.log(new Error(err));
    });
  },

  /**
   * Method: hashes password and then saves hashed password with salt
   * instead of saving cleartext password.
   * No parameters, returns a promise
  */
  hashPassword: function(){
    return bcrypt.genSaltAsync(null).bind(this)
    .then(function(salt) {
      return bcrypt.hashAsync(this.get('password'), salt, function() {});
    })
    .then(function(hash) {
      this.set('password', hash);
    });
  }
});

module.exports = User;

