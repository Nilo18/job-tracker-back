const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = 3000
const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const jobApplicationRouter = require('./routes/jobApplicationRoute.js')
const jobSearchRouter = require('./routes/jobSearchRoute.js')
const jobAuthRouter = require('./routes/jobAuthRoute.js')
const passport = require('passport')
const session = require('express-session')
const { Strategy } = require('passport-facebook')
// SESSION_SECRET

app.use(cors({
    origin: ['http://localhost:4200']
}))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
app.use('/api/search', jobSearchRouter)
app.use('/api/auth', jobAuthRouter)
app.use('/api/jobs', jobApplicationRouter)

passport.use(new Strategy(
  {
    clientID: '876631571861830',
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
  },
  function (accessToken, refreshToken, profile, done) {
    // This runs AFTER Facebook validates the user

    const user = {
      facebookId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName
    };

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
    // console.log(process.env.REDIRECT_URI)
    // console.log(process.env.CLIENT_SECRET)
})

async function connect() {
    try {
        await mongoose.connect(mongoURI)   
        console.log('Connected to the database.')     
    } catch (error) {   
        console.log("Couldn't connect to the databse: ", error)
    }
}

connect()