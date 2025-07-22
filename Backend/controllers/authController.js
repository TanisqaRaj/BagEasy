import User from "../models/Signup.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });

    if (userExist)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).json({ message: "wrong password" });

    const token = jwt.sign(
      { userId: user._id, username: user.email },
      process.env.JWT_SECRETKEY,
      { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRYTIME }
    );

    const responsedata ={
      email:user.email,
      name:user.name,
    }
     return res.status(200).json({
      message: "Login Success",
      token,
      user:responsedata,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkTokenExpiry = async (req, res) => {
  const token = req.body?.token;
  if (!token) {
    return res
      .status(200)
      .json({ success: false, message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
   const user = await User.findById(decoded.userId);


    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Token is valid", user });
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(200).json({ success: false, message: "Invalid Token" });
  }
};