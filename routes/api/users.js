const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')  ;

// User model
const User = require("../../models/User.js");
const UserSession = require("../../models/UserSession.js");

// @route GET api/users
// register all users

router.post('/register', (req, res) => {
   const {name, email, password, password2 } = req.body;

   //Simple validaton 
   if (!name || !email || !password || !password2) {
      return res.send({ success:false, msg: 'Please enter all fields'});
   }
   if (password !== password2) {
      return res.status(400).json({ msg: 'Password do not match'});
   }

   //Check fro existing user
   User.findOne({ email : email })
      .then( user => {
         if(user) return res.send({ success: false, msg: 'User already exists'})
         
         const newUser = new User({ name, email, password });

         // Create salt & hash
         bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
               if(err) throw err;
               // Set password to hashed
               newUser.password = hash;
               // save user
               newUser.save()
                  .then(user => {
                     res.send({ 
                        success: true,
                        msg: 'Signed up'
                     })
                  });
            })
         })
      })

});

// Login 
router.post('/login', (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password ) {
        return res.send({ success:false, msg: 'Please enter all fields'});
    }
    User.findOne({ email:email })
    .then(user => {
        if(!user) {
            return res.send({ success: false, msg: 'that email is not registre' });
        }
        
        //Match password ?
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;

            if(!isMatch) {
                return res.send({ success: false, msg:'incorrect password'})
            }
            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err) {
                    return res.send({ success: false, msg: "Error: server error"});
                }
                return res.send({
                    success: true,
                    msg: 'you\'re logged',
                    token: doc._id

                })
            })
        });
     })
    .catch(err => console.log(err));


    
   
});
//Verify
router.get('/verify', (req, res, next) => {
    //Get the token 
    const { query, token } = {req, query};
    // Verfiy the token
    UserSession.find(
        {
          _id: token,
          isDeleted: false
        },null, (err, sessions) => {
        if(err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }
        if (sessions.length != 1){
            return res.send({
               success: false   ,
               message: 'Error: Invalid'
            });
        }
        else {
            return res.send({
               success: true,
               message: 'Good'
            });
         }

       });
});
router.get('/logout', (req, res) => {
    //Get the token 
    const { query, token } = {req, query};
    // Verfiy the token
    UserSession.findOneAndUpdate(
        {
          _id: token,
          isDeleted: false
        }, 
         { $set:{isDeleted:"true" }
        },null, (err, sessions) => {
        if(err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }
        if (sessions.length != 1){
            return res.send({
               success: false   ,
               message: 'Error: Invalid'
            });
        }
        else {
            return res.send({
               success: true,
               message: 'Good'
            });
         }

       });
 })
module.exports = router;