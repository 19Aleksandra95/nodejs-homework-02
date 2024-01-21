const User = require ("../models/user.js");
const wrapperCtrl = require("../services/ctrlWrapper.js")
const validateUser = require("../services/validateUser.js")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const addUser = async (req, res) => {
  validateUser.validateUser(req.body);
  const { email, password } = req.body
  const userTwin = await User.findOne({email});
  if (userTwin !== null) {
    return res.status(409).json({"message": "Email in use"})
  }
    const passwordHash = await bcrypt.hash(password, 10)
   const user =await User.create({email, password: passwordHash});

      const {subscription} = user;
      
      res.status(201).json({user: {email, subscription}});
   }

   const logUser = async(req, res) => {

    validateUser.validateUser(req.body);
    const { email, password } = req.body
    
    const userLog = await User.findOne({email});
    if (userLog === null) {
      return res.status(401).json({"message": "Email or password is wrong"})
    }
    const isMatch = await bcrypt.compare(password, userLog.password);
    if (isMatch === false) {
      return res.status(401).json({"message": "Email or password is wrong"})
    }
   
    const token = jwt.sign({id: userLog._id}, process.env.JWT_SECRET, {expiresIn: 60*60});

    await User.findByIdAndUpdate(userLog._id, {token});

    res.send({token})
    const {subscription} = userLog;
    res.status(200).json({user: {email, subscription}});
   }

   const logout = async (req, res) =>{
   await User.findByIdAndUpdate(req.user._id, {token: null})
   res.status(204).end()
   }

   const current = async (req, res) => {
    const user = await User.findById(req.user._id)
    const {email, subscription} = user;
    res.status(200).send({email, subscription})
   }

   module.exports = {
    addUser: wrapperCtrl(addUser),
    logUser: wrapperCtrl(logUser),
    logout: wrapperCtrl(logout),
    current: wrapperCtrl(current),
    }