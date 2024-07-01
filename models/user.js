const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true // This allows for users without a Google ID
  },
//   username: { type: String, required: true, unique: true },
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
});

// Plugin passport-local-mongoose to handle password hashing and salting
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);









// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");



// const userSchema = new Schema({
//     email:{
//         type:String,
//         required:true,
//     }
// })

// userSchema.plugin(passportLocalMongoose);

// const User = mongoose.model("User",userSchema);
// module.exports = User;