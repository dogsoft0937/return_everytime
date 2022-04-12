const express = require("express");
const router = express.Router();

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


const { List } = require("../models/List");
const { auth } = require("../middleware/auth");

//리스트 조회
router.get('/lists', auth, async (req, res) => {
    if (req.user._id) {
        List.find({ userId: req.user._id }).then((list) => {
            res.status(201).json(list);
        }).catch((err) => { res.status(400).json({ err }) })
    }
})
router.post('/add-list', auth, async (req, res) => {
    const content = req.body.content;
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const list = new List({ userId: req.user._id, content, createdAt });
    list.save((err, list) => {
        if (err) {
            return res.status(400).json({ msg: err });
        } else {
            return res.status(201).json({ success: true });
        }
    })
})
router.put('/modify-list', auth, async (req, res) => {
    const content = req.body.content;
    const listId = req.body.listId;
    List.findOne({ _id: listId }, (err, list) => {
        console.log(list.userId,req.user._id);
        if (list.userId.equals(req.user._id)) {
            List.updateOne({ _id: listId }, { content }, (err, result) => {
                console.log(result);
                if (err) {
                    return res.status(400).json({err});
                } else {
                    return res.status(201).json({ success: true });
                }
            })
        }
    })
})
router.delete('/delete-list',auth,async(req,res)=>{
    const listId=req.body.listId;
    List.findOneAndDelete({_id:listId},(err,list)=>{
        if(err){
            return res.status(400).json({err});
        }else if(list){
            return res.status(201).json({success:true});
        }else{
            return res.status(400).json({msg:"not exist"})
        }
    })
})
router.put('/check-list',auth,async(req,res)=>{
    const listId=req.body.listId;
    List.findOne({_id:listId},(err,list)=>{
        if(err){
            return res.status(400).json({err});
        }else if(list){
            list.updateWhether((err,result)=>{
                if(err){
                    return res.status(400).json({err});
                }else{
                    return res.status(201).json({success:true});
                }
            })
        }else{
            return res.status(400).json({msg:"not exist"})
        }
    })
})
module.exports = router;
