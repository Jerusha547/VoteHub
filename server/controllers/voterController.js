const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const VoterModel = require("../models/voterModel");
const HttpError = require("../models/ErrorModel");

// =============== REGISTER NEW VOTER
// POST : api/voters.register
// UNPROTECTED
const registerVoter = async (req, res, next) => {
  try {
    const { fullName, email, password, password2 } = req.body;
    if (!fullName || !email || !password || !password2) {
      return next(new HttpError("Fill in all fields.", 422));
    }
    // make all emails lowercased
    const newEmail = email.toLowerCase();
    // check if the email already exists in db
    const emailExists = await VoterModel.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }
    //make sure password 6+ characters
    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters.", 422)
      );
    }
    //make sure passwords match
    if (password != password2) {
      return next(new HttpError("Passwords do not match"));
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // No user/voter should be admin except for one with email "marthajerushamarumudi7@gmail.com"
    let isAdmin = false;
    if (newEmail == "marthajerushamarumudi7@gmail.com") {
      isAdmin = true;
    }
    // save new voter to db
    const newVoter = await VoterModel.create({
      fullName,
      email: newEmail,
      password: hashedPassword,
      isAdmin,
    });
    res.status(201).json(`New voter ${fullName} created.`);
  } catch (error) {
    return next(new HttpError("Voter registration failed.", 422));
  }
};

// function to generate token
const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};
// =============== LOGIN VOTER
// POST : api/voters/login
// UNPROTECTED
const loginVoter = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }
    const newEmail = email.toLowerCase();
    const voter = await VoterModel.findOne({ email: newEmail });
    if (!voter) {
      return next(new HttpError("Invalid credentials.", 422));
    }
    // compare passwords
    const comparePass = await bcrypt.compare(password, voter.password);
    if (!comparePass) {
      return next(new HttpError("Invalid credentials.", 422));
    }
    const { _id: id, isAdmin, votedElections } = voter;
    const token = generateToken({ id, isAdmin });

    res.json({ token, id, votedElections, isAdmin });
  } catch (error) {
    return next(
      new HttpError(
        "Login failed. Please check your credentials or try again later.",
        422
      )
    );
  }
};

// =============== GET VOTER
// POST : api/voters/:id
// UNPROTECTED
const getVoter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const voter = await VoterModel.findById(id).select("-password");
    res.json(voter);
  } catch (error) {
    return next(new HttpError("Could not get voter"), 404);
  }
};

module.exports = { registerVoter, loginVoter, getVoter };
