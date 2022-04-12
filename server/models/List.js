const mongoose = require("mongoose");
// 커뮤니티 게시글

const listSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  whether: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: String,
    required:true
  },

});
listSchema.methods.updateWhether = function (cb) {
  var list = this;
  list.whether=!list.whether;
  list.save();
  return cb();
};
const List = mongoose.model("List", listSchema);

module.exports = { List };
