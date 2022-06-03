const mongoose = require("mongoose");
// 커뮤니티 게시글
const commentSchema=mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    requried:true
  },
  content:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now,
  }
})
const heartsSchema=mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    requried:true
  },
})

const communitySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title:{
    type:String,
    required:true,
  },
  content: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt:{
    type:Date,
    default:Date.now,
  },
  images:[{image:String}],
  comments:[commentSchema],
  hearts:[heartsSchema]
});

communitySchema.methods.updateView = function (cb) {
  var post = this;
  post.views++;
  post.save();
  return cb();
};  
const Community = mongoose.model("Community", communitySchema);

module.exports = { Community };
