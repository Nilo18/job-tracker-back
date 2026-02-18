const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean },
  name: { type: String },
  profilePicture: { type: String },

  providers: {
    google: {
      id: { type: String, unique: true, sparse: true },
      accessToken: String,
      // optional extra data from Google
    },
    facebook: {
      id: { type: String, unique: true, sparse: true },
      accessToken: String,
      // optional extra data from Facebook
    },
    // Add other providers similarly
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema)
module.exports = User