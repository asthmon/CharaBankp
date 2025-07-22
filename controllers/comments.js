const Waifulocation = require('../models/waifuground');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res, next) => {
    const { id } = req.params;
    const waifulocation = await Waifulocation.findById(id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    waifulocation.comments.push(comment);
    await comment.save();
    await waifulocation.save();
    req.flash('success', 'Comment Added!!');
    res.redirect(`/waifulocations/${id}`)
}

module.exports.deleteComment = async (req, res) => {
    const { id, id2 } = req.params;
    await Waifulocation.findByIdAndUpdate(id, { $pull: { comments: id2 } });
    await Comment.findByIdAndDelete(id2)
    req.flash('success', 'Comment Deleted!!');
    res.redirect(`/waifulocations/${id}`)
}