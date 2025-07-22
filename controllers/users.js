const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = await new User({ email, username });
        const registUser = await User.register(newUser, password);
        req.login(registUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome To my Website : 3');
            res.redirect('/waifulocations');
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Successfuly Logged in!!');
    const redirectUrl = res.locals.returnTo || "/waifulocations";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        return res.redirect('/');
    });
}