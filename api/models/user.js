const { STORAGE_HOST, STORAGE_PORT } = process.env;
const mongoose = require("mongoose");
const { compareString, hashString } = require("../utils/encryption");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    phone: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true
    },
    nick: { type: String, default: null },
    username: { type: String, default: null },
    name: { type: String, default: null },
    lastname: { type: String, default: null },
    verified: { type: Boolean, default: false },
    password: { type: String, default: null, select: false },
    token: { type: String, default: null },
    verifyToken: { type: String, default: null },
    forgotToken: { type: String, default: null },
    phoneToken: { type: String, default: null },
    walletAddress: { type: String, default: null },
    walletPk: { type: String, default: null },
    pictureHash: { type: String, default: null },
    imageUrl: { type: String, default: null },
    lastBalance: { type: String, default: "0", required: true },
    sc: { type: Boolean, default: false },
    did: { type: String, default: null },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

userSchema.virtual("picture").get(function() {
  // For retro-compatibility
  return this.imageUrl;
});

// Before saving the user in any case, we hash the password that is set to it.
// The passwords are never stored in clear text.
userSchema.pre("save", function(next) {
  const user = this;
  user.updatedAt = new Date();
  if (!user.isModified("password")) {
    next();
  } else {
    hashString(user.password).then(function({ result }) {
      user.password = result;
      next();
    });
  }
});

userSchema.methods.comparePassword = async function plaintext(plaintext) {
  const { result } = await compareString(plaintext, this.password);
  return result;
};

userSchema.statics.findByToken = function(token) {
  return this.findOne({ token });
};

module.exports = mongoose.model("User", userSchema);
