
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors');
// const cookieParser = require("cookie-parser");
// const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000

// Parser options
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));  // parse application/x-www-form-urlencoded

app.use(express.json())
// app.use(bodyParser.json({limit: '10mb'}));
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cors({
  origin: 'http://127.0.0.1:5173',
  // origin: 'http://localhost:5173',
  credentials: true
}))

// Establish the connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
})

// Routes
const blogRoutes = require('./src/routes/blog.route')
const commentRoutes = require('./src/routes/comment.route')
const userRoutes = require('./src/routes/auth.user.route')

app.use("/api/auth", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);

// Listening at Port 1000 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})