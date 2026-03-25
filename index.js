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
const session = require('express-session')
const { Strategy } = require('passport-facebook')

app.use(cors({
    origin: ['http://localhost:4200']
}))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send("Please provide a prompt.")
  }

  try {
    const response = await fetch("http://localhost:8000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).send(errText);
    }

    const data = await response.json();
    res.json({ result: data.result });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.use(express.json())
app.use('/api/search', jobSearchRouter)
app.use('/api/auth', jobAuthRouter)
app.use('/api/jobs', jobApplicationRouter)


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

async function connect() {
    try {
        await mongoose.connect(mongoURI)   
        console.log('Connected to the database.')     
    } catch (error) {   
        console.error("Database connection error:", error)
    }
}

connect()