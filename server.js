require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]
app.get('/posts', AuthenticateToken, (req, res) =>{
  //if token is valid, will return a req.user, let's check and only return if the name is the same
  res.json(posts.filter(post => post.username === req.user.name))
})

//Now authentication only excute in authServer
// app.post('/login', (req, res) => {
//   //Authenticate User

//   const username = req.body.username
//   const user = { name: username}

//   const accessToken = jwt.sign(user, 
//     process.env.ACCESS_TOKEN_SECRET)
//   res.json({ accessToken: accessToken })
// })

//add a middleware
/* get the token they sent to us and verify, if it valid
 return their user information (app.get), so we need to add
 this middleware into app.get('/posts') */
function AuthenticateToken(req, res, next) {
  // we want this -- Bearer TOKEN --
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)  //have token but not valid
    req.user = user
    next()
  })
  
}
app.listen(3000)