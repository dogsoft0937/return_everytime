const express = require("express");
const router = express.Router();

// var moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault("Asia/Seoul");

const { Community } = require("../models/Community");
const { auth } = require("../middleware/auth");
const {User}=require('../models/User');
//게시글 조회
router.get('/', auth, async (req, res) => {
    // Community.find().then(async (posts) => {
    //    const result=await communityPost(posts);
    // }).catch((err) => { return res.status(400).json({ err }) })
    const posts=await Community.find();
    const result=await communityPost(posts);
    return res.status(201).json(result);
})
//게시글 생성
router.post('/', auth, async (req, res) => {
    const postData={
        userId:req.user._id,
        title:req.body.title,
        content:req.body.content,
    }
    const community = new Community(postData);
    community.save((err, post) => {
        if (err) {
            return res.status(400).json({ msg: err });
        } else {
            return res.status(201).json({ success: true });
        }
    })
})
//게시글 수정
router.put('/', auth, async (req, res) => {
    const postData={
        title:req.body.title,
        content:req.body.content,
    }
    const postId = req.body.postId;
    Community.findOne({ _id: postId }, (err, post) => {
        if (post.userId.equals(req.user._id)) {
            Community.updateOne({ _id: postId },postData, (err, result) => {
                console.log(result);
                if (err) {
                    return res.status(400).json({ err });
                } else {
                    return res.status(201).json({ success: true });
                }
            })
        }
    })
})
//게시글 삭제
router.delete('/delete', auth, async (req, res) => {
    const postId = req.body.postId;
    Community.findOneAndDelete({ _id: postId }, (err, post) => {
        if (err) {
            return res.status(400).json({ err });
        } else if (post) {
            return res.status(201).json({ success: true });
        } else {
            return res.status(400).json({ msg: "not exist" })
        }
    })
})
//게시글 상세조회
router.get('/lookup', auth, async (req, res) => {
    const postId = req.body.postId;
    Community.findOne({ _id: postId }, (err, post) => {
        if (err) {
            return res.status(400).json({ err });
        } else if (post) {
            post.updateView((err, result) => {
                if (err) {
                    return res.status(400).json({ err });
                }else{
                    return res.status(201).json({ post });
                }
            })
        } else {
            return res.status(400).json({ msg: "not exist" })
        }
    })
})
//게시글 조회내용 데이터 필터링
const communityPost=async(posts)=>{
    const res=[];
    for(const post of posts){
        const postres={
            id:post._id,
            title:post.title,
            views:post.views,
            createdat:post.createdAt,
            writer:await User.getnickname(post.userId),
        }
        res.push(postres)
    }
    return res;
}
module.exports = router;
