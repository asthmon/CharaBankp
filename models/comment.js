const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const commentSchema = Schema({
    body: String,
    score: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Comment', commentSchema)
