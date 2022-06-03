const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

router.get("/auth", auth, (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.summary = "사용자 인증" */
  res.json({
    loginId: req.user.loginId,
    nickname:req.user.nickname,
    _id: req.user._id,
  });
});
router.post("/register",(req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.summary = "회원가입" */
  User.findOne({ loginId: req.body.loginId }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (user) {
      return res.status(400).json({ msg: "Duplicate data exists" });
    } else {
      const user = new User({
        loginId: req.body.loginId,
        nickname:req.body.nickname,
        password: req.body.password,
      });
      User.encpass(user.password,(err,hash)=>{
        if(err){
          return res.status(400).json(err);
        }else{
          user.password=hash;
          user.save((err, doc) => {
            if (err) {
              return res.status(400).json({ msg: err });
            } else {
              return res.status(201).json({
                _id: doc._id,
              });
            }
          });
        }
      });
    }
  });
});
router.post("/login", (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.summary = "로그인" */
  User.findOne({ loginId: req.body.loginId }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else if (!user) {
      return res.status(400).json({ msg: "Account does not exist" });
    } else {
      user.checkPassword(req.body.password, (err, isMatch) => {
        if (err) {
          return res.status(400).json({ msg: err });
        } else if (!isMatch) {
          return res.status(400).json({ msg: "Wrong Password" });
        } else {
          user.createToken((err, user) => {
            if (err) {
              return res.status(400).json({ msg: err });
            } else {
              res.cookie("auth", user.token).status(201).json({
                _id: user._id,
                loginId: user.loginId,
              });
            }
          });
        }
      });
    }
  });
});

router.get("/logout", auth, (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.summary = "로그아웃" */
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ msg: err });
    return res.json({
      msg: "LogOut Success",
    });
  });
});

module.exports = router;
