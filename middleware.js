const { waifulocationsSchema, commentSchema } = require('./schemas');
const ExpressError = require('./utils/expressError');
const Waifulocation = require('./models/waifuground');
const Comment = require('./models/comment')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateData = (req, res, next) => {

    const { error } = waifulocationsSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const waifulocation = await Waifulocation.findById(id);
    if (!waifulocation.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!')
        return res.redirect(`/waifulocations/${id}`)
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, id2 } = req.params;
    const comment = await Comment.findById(id2);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!')
        return res.redirect(`/waifulocations/${id}`)
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}