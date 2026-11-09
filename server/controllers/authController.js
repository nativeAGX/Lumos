const User = require('../models/User');

// Default municipal users for reference & seeder
const DEFAULT_USERS = {
  ward_officer: {
    id: 'ward_officer',
    roleKey: 'ward_officer',
    title: 'Ward Officer / Municipal In-Charge',
    name: 'Dr. Sandeep Deshmukh',
    email: 'officer.deshmukh@somaiya.gov.in',
    password: 'password123',
    ward: 'Ward 12 — Somaiya Vidyavihar',
    type: 'OPERATIONS',
    badge: 'Tier-3 Auth',
    avatar: 'SD'
  },
  field_tech: {
    id: 'field_tech',
    roleKey: 'field_tech',
    title: 'Field Lead Technician',
    name: 'Rajesh Kumar',
    unit: 'Somaiya Unit #07',
    email: 'rajesh.k@field.lumos.gov.in',
    password: 'password123',
    ward: 'Ward 12 Electrical Cell',
    type: 'OPERATIONS',
    badge: 'Field Ops',
    avatar: 'RK'
  },
  citizen: {
    id: 'citizen',
    roleKey: 'citizen',
    title: 'Registered Resident',
    name: 'Rahul M.',
    phone: '+91 98201 44820',
    email: 'rahul.m@somaiya.edu',
    password: 'password123',
    ward: 'Ward 12 Somaiya Campus',
    type: 'CITIZEN',
    badge: 'Verified Resident',
    avatar: 'RM'
  }
};

// Helper: issue token response with user role
const sendTokenResponse = (user, statusCode, res, message = 'Authenticated successfully') => {
  const token = user.getSignedJwtToken();

  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    role: user.roleKey,
    data: userObj
  });
};

// @desc    Register a new resident account (Public self-registration strictly restricted to citizen role)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, roleKey, ward, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    // Role escalation prevention: public self-registration is strictly restricted to citizen accounts
    if (roleKey && roleKey !== 'citizen') {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Public self-registration is restricted to the 'citizen' role. Operations roles ('ward_officer', 'field_tech') must be provisioned administratively."
      });
    }

    const chosenRole = 'citizen';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `An account with email ${email} already exists.`
      });
    }

    const userId = `citizen_${Math.floor(1000 + Math.random() * 9000)}`;

    // User.create invokes the bcrypt pre('save') hook in User model
    const user = await User.create({
      id: userId,
      roleKey: chosenRole,
      title: 'Registered Civic Resident',
      name,
      email: email.toLowerCase(),
      password, // hashed with bcryptjs in pre-save hook
      ward: ward || 'Ward 12 — Somaiya Vidyavihar',
      phone: phone || '',
      type: 'CITIZEN',
      badge: 'Verified Resident',
      avatar: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    });

    sendTokenResponse(user, 201, res, 'Citizen account registered successfully with bcrypt encryption and JWT token');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & return JWT token (Strict email & bcrypt password check)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Both email and password are required
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password to log in.'
      });
    }

    // Lookup user strictly by email (with password included for bcrypt comparison)
    let user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    // If default demo seed user does not exist in DB yet, auto-create it from template
    if (!user) {
      const demoAccount = Object.values(DEFAULT_USERS).find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );
      if (demoAccount) {
        user = await User.create(demoAccount);
        user = await User.findById(user._id).select('+password');
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // Compare entered password with hashed password using bcryptjs
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    sendTokenResponse(
      user,
      200,
      res,
      `Authenticated as ${user.title} (${user.roleKey.toUpperCase()})`
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get currently authenticated user from verified JWT
// @route   GET /api/auth/me
// @access  Private (Protected with JWT)
exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered municipal users (Restricted to Ward Officer)
// @route   GET /api/auth/users
// @access  Private (Protected with JWT + Ward Officer RBAC)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
