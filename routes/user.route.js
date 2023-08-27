const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const  jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const a= "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..jibCu9CW0p439bVy.4C2pb6Maj8UqAZkSzp5J028jNazhUe8z23F9I0CmIfmo3keL61AuyoHPW9OwEoO_2rdUTbL9es2ElO9hYduzvW2974kvvnynnC8VNTT-U4DqYc2zBVZVtDjPh5HoESxowxk_Anr8Ye5QEDmVz9iXuVEUF15oQsTC9M2CCtNOu2PIyIlv5GAICf9cb1vQz8Uo-t4Fchp3ncgUseOCryDWS4yT8y4_CRKzYSOEmWg5vRbXGj7d69n3-pflgt_1XilT18jDRHGSd9Uxin1n8D1x1OuAvhwnj1Z6PGsTNWtfgCf1FDXv1QM0Rx6ICDxERsKBW2WpFA7cxnzPtlqtxKw-X9VcBoOY-PMfy8Vpb7GboA7iXJFYgWAxD9EdeE5XayiJzsA_5rhYJdnVPZHE8zgh5kn1uY_lb8qnqKXNbofZuaVoRnc-0eJeAIKQjbSVzNcl40EHNOiNQJaS6jBM1vUlBaDo1WA8MMavCTMANtkbER9SL-Ka-t8ujXgmFWsxrrislI0UG0Cxt8bqq6cL-Dev5qpGXJ4tI6ic-GB7svhUPmv16MG3AkMxwIlq7lL34WZuHH0srR7dwYvI7_2o-teBfJNAwuG6RV_4MEyxVwLU_5b723nwG_qhoN1GoJqOict7Z7N6WoIGYLyBBbWI_0lR5rhS1JOBpdnnKnn92N3W6MQHC-9MbMyVIGfCFH4IqC8TIBK33Fp9iZEYD6w0drZpyaKsPyDi-qt18k38GBnSwL-nXHG0uJms4EINW8e7cZ6Ji3JdaImt0vmbqNMhL5YV-qYSSEmKywvxqXH-FgKsW1vXaLPy2l4b4x91NQX2BvwiUK3y502S8Y1Cd2pNP57T4T-XXac3-3Mqpq0ApNtHWoXxp6QLlhmBM4t4yFLz47Z_qrKWC8WvdWLDGlm6ZYQL89FZr3SlvPlzpOaCbaHrLR_G94_UUQ7i7Svyc63Go7Sxed8H39dpfN45q4AD4XlzNVEGO62BT1PzvmeIskcEHZGUdKenmjxNih7KlPtmqTYjEF0a_8I-DSl55ldn_e1uRPXwqC6RfbL7csh9D-L6nlpuvmDKgDSYL9a4a7OuP_FwOvsglcusZrkrqqJg7TMVAfGr5Pq4hyzH-vg9LJgVqoFJiEkOwrvkEpk1JG9LmUMwGnPg5_Ca3Wmxbh8IsFFN7qnHUclHQuTh0hXvbF4RmM6KrvoBcrLBc3suIMxHGbUZGvHq9gm0PJs0W_wm5v6jWoFzKtXDTU-l5WwnFiA93T5hws9y1CGyuSKAn-qaavTxAcF0G9dNi6ESstbq0Wft7L3dm71dTo0c8SVtFiCms3KsfipVR_FW1R4qm_ZBT1QLOxtC-fZDjz9nB2N_dIhuniv2OJd-Ki9MRDDPpHGLD4uI7rM1f2xLB7XayiOg0-bMBiJnZaJnTDYhnxGvwwNwbCx6q0AkcUuIadaVYvxc5PncK41nU2Eajo8iXuOu1dfYCo81pDT7uioFV--4CFWsF0ab523xpiv9jEkaO-kvX6LzEFqi66iG5YQ9EJ8AlIH_E3IA8QfaDp0bHeFGMIKeadyYiVdY1vVAiwCGCVQAxmP9ch4qy3N-WSoLgvoHQSyyEvFC_GwnMrX-sRnQBlOd3aHVqsEZB9vnZqv7sVFo3_31KOMgMXw2_QmGXnFyAXiNVZB3dgNYNjoFmd-YqtpQrreS22mknUbQ-LEjkp4HP3HmyrzGR22XA9iiFqY3FocKhUtd7Qe2fUR8gDBK6LG3frF7R5QUaA.7OD6zuNIJoLeeZSwn0dUOg"


const b = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..Blxk1m6xQppUzI0A.9yxF5xZnEPmZBalONSh-dGtW2370N_edPQ-ygCORnSrK1LdVPzSxgaDJC5dDnsacRboqLKimBiQcRug2j0v3XdqpnGpYsB7mUWd_255NF1EDeOj75YJNHm9SpxkHoJ575WcC0cXzt7rP_vzPvNp4jBtltZSRw-b4gKKlKqNiCuxVSiB3LefDGVwnJIrDGkZp1tOMVJZXiJeRr4R6ZLC-2RGv37Bh_v4t-eA8KP97ezeaCQIhUhgIMT0xTIsiZoq7c9rpW6wSKT7SByeHMRGGaCpDiFTwm0le5drfnr-9XWiZ41amNpPwZFlzyDR1VTt5MgvArAgJduD8tRp-oE3VT2GH6btjmhJgJhfVKyRuRvLCV1L-_VjTvXzkQVc8Osd4geT951AwePfZdvetv-2Ugg8X6MipK-N5ejCB_vEam3XD6Myw5Axfo82FlrDiQ7b6B8lzXceIBJIdCtqwnMFDBOneFZFaCjTBksSq0RRK2wK_gKzeCcuDrImK4Kk7XgnvuFjhANtnCVkNXM0qbWs2xDISntTQSEkZ38iERyIXQPvup2UMy5KOlzEUHeu8UK0O_gMlwFilN1ftOK4aEulXfaSWeKMt5x66EVFaNxDqKxGDhk-XBhTdyviJ8cPTcwBb4oAVCz7UxrqWORrwZ6PEl3HP4UI_EKHaSdAciOw6feuqmUYG2EhahJ82ynbj_h-edkLvCE6KueQHcc5CoOkTgQxNntLgYkNOn51xb1K1tBsYtYOputkCMmWS3yhbcTtHRq5B3nx6G7GuwCtAvN4R8NrRjm_yGNWlJYxYd13a8D7gpf9u8KcQxEz4ciXFPaC1Z_oWgfNihm1BATS6_elv7ouJWsiD6MGrgIhtPlUubw3YaB01y15NG5i_TQSL99drPtBVvoeoipSehEnSrB3ZUIwBuHgZ-6p0VPA0VGegRrxh8obI-sySZPIobF5URMJYrEkS5uPmuz9Rm-EcM5_ilMeTkx1NHhyGpgu2MsAmSrnH9EXSc2Q8wPISnGUM4vDK4x1QTwnrydNbtFNY7Z0AcVEfGrHmd7hC0gxVXKPRESzF0L0K8396t9aJawTZgPn1grPclXZljGEFtaq-3_U5qC6FPuFRavh5E4gK8PaX7o6C_MGEO89MlrPkFRjhYPnLmVXEMr-gyg38VJWTx4HwdGuZS54KETr8qhBHZJhvHhriwWNyQ1aiHxQP6-Kl6C2JQQNwNepACnxy2BdBZ4Y3QCwXM2AxCBZvR7Y2yLZzPaKa4-LZSug9Wd-OalEpWrdnYjaVbpVWJJ1aj8-bhzNAec4zervhITivzO6ALoI_w4nR3hiylK_JQO-gg57xFY4AqTkp-HVJ6cbwgReYqDGww1wn6mp61Xy-H9jOhND8wOo_clTpBPiIMh7vm-mSf_sjjJEtE5TUdhYWdOFsAw1DBSx1m0HKZ-vFxt3ydF0i7zj67HVxY6n3xkIP0ajay7miRa68niAf3UAMC15IB_jkRx3nDPI6vBhgwUEdodBmLvKMhp21qmnHeP9YSB_G-Tm6FZncm05G8PZxanusiGtatHrUYV4-T2cGizNf2gJFs-m-AyEtHsAo-2C6vISH5SqUXa56FNtSGu-DBEfgviF4twy0TBY-7ORo3lIOYEqcCWzsbvk6PCNQx0lMmfbPhutE-bAeekJIVRVmypmepbP0u0Q-79KaV8K_VuYRBOcX-jOB9Ncikthv1w7QtyLQUnvgjviWmCETiOBWzkGVdrvo6o3MJ7A0GQ.VwnmU0kioTmyWouDjaCpeQ"

//Register

router.post('/register', async (req, res, )=> {
    const{email,password,role,firstname,lastname,isActive,avatar}=req.body;
    
    const user = await User.findOne({ email })
    if (user) return res.status(404).send({ success: false, message: "User already exists" })
    
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

// se connecter
router.post('/login', async (req, res) =>  {
  let expires = Date.now() + 1
  try {
      let { email, password } = req.body

      if (!email || !password) {
          return res.status(404).send({ success: false, message: "All fields are required" })
      }

      let user = await User.findOne({ email }).select('+password').select('+isActive')
      

      if (!user) {

          return res.status(404).send({ success: false, message: "Account doesn't exists" })

      } else {

    let isCorrectPassword = await bcrypt.compare(password, user.password)
     if (isCorrectPassword) {

              delete user._doc.password
              if (!user.isActive) return res.status(200).send({ success: false, message: 'Your account is inactive, Please contact your administrator' })

              const token = generateAccessToken(user);
 
             const refreshToken = generateRefreshToken(user);
       
          

              return res.status(200).send({ success: true, user, token,refreshToken,expiresIn: expires  })

          } else {

              return res.status(404).send({ success: false, message: "Please verify your credentials" })

          }

      }

  } catch (err) {
      return res.status(404).send({ success: false, message: err.message })
  }

 });

//Access Token 
const generateAccessToken=(user) =>{
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
  }

  // Refresh
function generateRefreshToken(user) {
    return jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
  }
  
  //Refresh Route
  
  router.post('/refreshToken', async (req, res, )=> { 
    let expires = Date.now() + 3600 
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
           const token = generateAccessToken(user);
 
           const refreshToken = generateRefreshToken(user);
   
          res.status(200).json({
            token,
           refreshToken,
           expiresIn: expires
         })
            }
        });
       }
 
  
  });


  /**
 * as an admin i can disable or enable an account 
 */
  router.put('/status/edit',  async (req, res) =>  {
    try {

        let { idUser } = req.body
        let user = await User.findById(idUser).select('+isActive')
        user.isActive = !user.isActive
        user.save()
        res.status(200).send({ success: true, user })
    } catch (err) {
        return res.status(404).send({ success: false, message: err })
    }
   })

// afficher la liste des utilisateurs.
router.get('/', async (req, res, )=> {
  try {
      const users = await User.find().select("-password");              
      res.status(200).json(users);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }

});

  module.exports = router;


