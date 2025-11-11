
const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();
const authRoutes = require('./src/routes/auth');
const cors = require('cors');
app.use(cors());


app.use('/api', authRoutes);




const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});