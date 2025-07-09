import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // username: { type: String, required: true, unique: true },
  // email: { type: String, required: true, unique: true },

  profile_pic: { type: String, default: "" }, // pic url
  location: { type: String, default: "" },
  bio: { type: String, default: "", maxlength: 250 },

  soundcloudId: { type: Number, unique: true, sparse: true }, // SoundCloud user ID
  soundcloudUsername: { type: String },
  soundcloudAvatar: { type: String },

  likedTracks: [
    {
      trackId: Number,
      title: String,
      artist: String,
      artworkUrl: String,
    },
  ],

  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", UserSchema);
export default User;
