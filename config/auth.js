module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) { // req.isAuthenticated 是 passport 提供的方法
      return next
    }
    res.redirect('/users/login')
  }
}
