const express = require('express')
const router = express.Router()
const request = require('request')

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express', isLoggedIn: !!req.session.userName })
})

router.get('/login', (req, res) => {
  if (req.session.userName) {
    return res.redirect('/')
  }
  const html = '<form action="/login" method="post">' +
             'Your name: <input type="text" name="userName"><br>' +
             '<button type="submit">Submit</button>' +
             '</form>'
  res.send(html)
})

router.post('/login', (req, res) => {
  req.session.userName = req.body.userName
  res.redirect('/login')
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

// Middleware
const checkauth = function (req, res, next) {
  if (!req.session.userName) {
    return next(new Error('You Are Not Authorized to Access this Resource!!'))
  }
  return next()
}
router.get('/mysecretpic', checkauth, (req, res) => {
  request('https://avatars2.githubusercontent.com/u/179581?v=3&s=460').pipe(res)
})

module.exports = router
