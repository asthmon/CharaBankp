const express = require('express');
const router = express.Router({ mergeParams: true });
const comments = require('../controllers/comments')
const catchAsync = require('../utils/asyncErrorhandler');
const Waifulocation = require('../models/waifuground');
const Comment = require('../models/comment');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware')





//Comment Route Post Path
router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment))

//Delete Comments
router.delete('/:id2', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))


module.exports = router;