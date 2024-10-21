const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Define a schema for the likes
const driveLikeSchema = new mongoose.Schema({
  driveId: String,
  likes: { type: Number, default: 0 }
});

const DriveLike = mongoose.model('DriveLike', driveLikeSchema);

// Endpoint to like a drive
app.post('/like', async (req, res) => {
  const { driveId } = req.body;
  
  let drive = await DriveLike.findOne({ driveId });
  
  if (!drive) {
    drive = new DriveLike({ driveId });
  }
  
  drive.likes += 1;
  await drive.save();
  
  res.json({ driveId, likes: drive.likes });
});

// Endpoint to get likes for a specific drive
app.get('/likes/:driveId', async (req, res) => {
  const { driveId } = req.params;
  
  const drive = await DriveLike.findOne({ driveId });
  
  res.json({ driveId, likes: drive ? drive.likes : 0 });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
