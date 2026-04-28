const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to DB");
    
    const result = await User.updateOne(
      { email: 'bomanthan51@gmail.com' },
      { $set: { isAdmin: true } }
    );
    
    if (result.matchedCount === 0) {
      console.log("User not found!");
      process.exit(1);
    }
    
    console.log("Success! Made bomanthan51@gmail.com an admin.");
    process.exit(0);
  })
  .catch(err => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
