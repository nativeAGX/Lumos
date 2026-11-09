const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    roleKey: {
      type: String,
      enum: ['ward_officer', 'field_tech', 'citizen'],
      default: 'citizen'
    },
    title: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    ward: { type: String, default: 'Ward 12 — Somaiya Vidyavihar' },
    phone: { type: String, default: '' },
    unit: { type: String, default: '' },
    type: { type: String, default: 'OPERATIONS' },
    badge: { type: String, default: 'Verified' },
    avatar: { type: String, default: 'US' }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property for 'role' matching 'roleKey'
userSchema.virtual('role').get(function () {
  return this.roleKey;
});

// Encrypt password using bcryptjs before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Issue JWT Token with role inside payload
userSchema.methods.getSignedJwtToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  return jwt.sign(
    {
      id: this.id || this._id,
      email: this.email,
      role: this.roleKey,       // 'ward_officer', 'field_tech', or 'citizen'
      roleKey: this.roleKey,
      name: this.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

module.exports = mongoose.model('User', userSchema);
