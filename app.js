
// ATLAS_USERNAME=tauheedshahid14
// ATLAS_PASSWORD=q8S120d6ArUYy6pR || 786@atlaspass
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000

// Parser options
app.use(express.json())
app.use(cors())

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