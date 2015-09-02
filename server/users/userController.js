var User = require('../database/users/user.js');
var Users = require('../database/users/users.js');
var Promise = require("bluebird");

var userRoutes = {
  signin: function (req, res) {
    console.log('SIGNING IN');
    return new Promise(function (resolve, reject) {
      console.log('about to lookup user with email');
      return new User({
          email: req.body.email
        })
        .fetch()
        .then(function (user) {
          console.log('done looking up user, going to comparePassword');
          if (!user) {
            // console.log("redirect to sign up");
            res.end(JSON.stringify({
              error: "user doesn't exist"
            }));
          } else {
            return user.comparePassword(req.body.password);
          }
        })
    })
    console.log("all routes");
    res.json({
      message: "user get message"
    });
  },
  signup: function (req, res) {
    return new Promise(function (resolve, reject) {
      // console.log(17, req.body.email);
      Users.query({
        where: {
          email: req.body.email
        }
      }).fetchOne().then(function (user) {
        // console.log(21, user);
        if (user) {
          res.end(JSON.stringify({
            error: "Email already exists"
          }));
        } else if (req.body.email) {
          console.log(37, "email provided");
          return new User({
            email: req.body.email,
            password: req.body.password
          }).save().then(function (newUser) {
            console.log(20, newUser);
            res.end(JSON.stringify(newUser));
          }).catch(function (err) {
            console.log(new Error(err));
            res.end(JSON.stringify(err));
          })
        } else {
          console.log(51, req.body);
          res.end(JSON.stringify({
            error: 'enter your email'
          }));
        }
      })
    });
  }
}
module.exports = userRoutes;
