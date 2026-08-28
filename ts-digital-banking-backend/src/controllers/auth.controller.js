const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Customer = require("../models/Customer");

const generateToken = (customerId) => {
  return jwt.sign(
    {
      id: customerId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};

const register = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      dateOfBirth,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !dateOfBirth
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, email, phone, password and date of birth are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingCustomer = await Customer.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: phone.trim() },
      ],
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const customer = await Customer.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      dateOfBirth,
    });

    const token = generateToken(customer._id.toString());

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: {
        customer: {
          id: customer._id,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          dateOfBirth: customer.dateOfBirth,
          isVerified: customer.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const customer = await Customer.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      customer.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(customer._id.toString());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        customer: {
          id: customer._id,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          dateOfBirth: customer.dateOfBirth,
          isVerified: customer.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};