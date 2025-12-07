
const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');
const cors = require('cors');
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);




const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});