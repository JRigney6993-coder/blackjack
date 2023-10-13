const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        if (req.xhr) { 
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            req.flash('error_msg', 'please login to view this resource');
            res.redirect('/login');
        }
    }
}

module.exports = {
    ensureAuthenticated
};
