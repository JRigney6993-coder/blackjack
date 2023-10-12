const ensureAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        // return true if user is logged in
        next();
    } else {
        req.flash('error_msg', 'please login to view this resource')
        res.redirect('/users/login')
    }
}

module.exports = {
    ensureAuthenticated
}