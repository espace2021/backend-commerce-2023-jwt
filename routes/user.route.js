const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const  jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Register

router.post('/', async (req, res, )=> {
    const{email,password,role,firstname,lastname,isActive,avatar}=req.body;
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(password,salt);
    const newUser=new User({
      email:email,
      password:hash,
      role:role||"user",
      firstname:firstname ||"myfirstname",
      lastname:lastname||"mylastname",
      isActive:isActive ||true,
      avatar:avatar||"avatar.jpg"
        });
    try {
           await newUser.save();
           return res.status(201).send({ success: true, message: "Account created successfully", user: newUser })
 
       } catch (error) {
           res.status(409).json({ message: error.message });
       }
  
});

//Login

router.post('/login', async (req, res, )=> {
    try {
        const{email,password}=req.body;
        const user = await User.findOne({email});
       if(user==""){  res.status(401).send('utilisateur non existant');
        return} ;
        const isMatch=await bcrypt.compare(password,user.password);
       if(!isMatch) {res.status(400).json({msg:'mot de passe incorrect'}); return;}

      // if(user.role!="admin") throw Error('Accès authorisé sauf pour admin');

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

       res.status(200).json({ 
        accessToken,
        refreshToken,
        user
      })
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

});

//Access Token 
const generateAccessToken=(user) =>{
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
  }

  // Refresh
function generateRefreshToken(user) {
    return jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
  }
  
  //Refresh Route
  
  router.post('/refreshToken', async (req, res, )=> {  
  const refreshtoken = req.body.refreshToken;
    if (!refreshtoken) {
     return res.status(404).json({ message: 'Token Not Found' });
        }
    else {
        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) {
            return res.status(406).json({ message: 'Unauthorized' });
          }
          else {
           const accessToken = generateAccessToken(user);
 
           const refreshToken = generateRefreshToken(user);
   
          res.status(200).json({
           accessToken,
           refreshToken
         })
            }
        });
       }
 
  
  });

  module.exports = router;


