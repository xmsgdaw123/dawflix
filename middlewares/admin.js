export default (req, res, next) => {
  if (!req.session.user) return res.render('index.ejs')
  if (req.session.user.role !== 'admin') return res.render('index.ejs')
  next()
}