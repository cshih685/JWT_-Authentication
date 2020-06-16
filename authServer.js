require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []


app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

/* delete the token */
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})
/* No longer need posts in port 4000
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
*/

app.post('/login', (req, res) => {
  //Authenticate User

  const username = req.body.username
  const user = { name: username}

  const accessToken = generateAccessToken(user)
  //create a refresh token
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})
/*add new function for both AccessToken and refreshToken*/
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}
/* add a middleware
 get the token they sent to us and verify, if it valid
 return their user information (app.get), so we need to add
 this middleware into app.get('/posts') 
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
*/

app.listen(4000)