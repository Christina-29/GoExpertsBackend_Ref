import { Request, Response, RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import _ from 'lodash';
import User from "../models/users";
import { validateEmail, validatePassword } from "../utils/validator";
import { hash } from "../utils/encryptor";
import { jwtSign } from "../utils/jwtService";
import { emailTemplate, sendEmail } from "../utils/emailService";
import generateToken from "../utils/tokenGenerator";

const getUsers = (req: Request, res: Response): void => {
  res.send("respond with a resource");
};

/**
 * POST api/users
 * @description User Sign Up
 * @param req {Object} The request
 * @param res {Object} The response
 * @returns
 */
const signUp: RequestHandler = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Please enter all required fields." });
  }

  const passwordValidataResult = validatePassword(password);
  if (!passwordValidataResult) {
    return res.status(400).json({
      error:
        "You must include at least 8 characters and a number/special character",
    });
  }

  const emailValidateResult = validateEmail(email);
  if (!emailValidateResult) {
    return res.status(400).json({
      error: "The email address is invalid",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      error: "The email has already been registered.",
    });
  }

  // send confirm email
  const confirmEmailToken = generateToken();
  const confirmEmailLink = `${process.env.FRONTEND_HOST_ADDRESS}/activation?token=${confirmEmailToken}`;
  const emailContent = emailTemplate.confirmEmail(firstName, confirmEmailLink);
  const sendEmailResult = await sendEmail(
    email,
    "Verify your email",
    emailContent
  );
  if (!sendEmailResult) {
    return res.status(500).json({ error: "Email server error" });
  }

  const userID = uuidv4();
  const hashedPassword = await hash(password);
  const user = new User({
    userID,
    email,
    firstName,
    lastName,
    password: hashedPassword,
    role: "client",
    confirmEmailToken,
    emailVerified: false,
  });

  try {
    const savedUser = await user.save();
    const token = jwtSign({ id: savedUser.userID, role: savedUser.role });
    return res.status(201).send({ token });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * PUT api/users/password-reset-link
 * @description User request reset password
 * @param req
 * @param res
 * @returns
 */
const sendPasswordResetLink: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(401).json({
      message: `There is no account associated with this email ${email}. Double-check your email address and try again.`,
    });
  }

  const resetPasswordToken = generateToken();
  try {
    await User.findOneAndUpdate(
      { userID: existingUser.userID },
      { $set: { resetPasswordToken } }
    );
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }

  const resetPasswordLink = `${process.env.FRONTEND_HOST_ADDRESS}/reset-password?token=${resetPasswordToken}`;
  const emailContent = emailTemplate.resetPasswordEmail(
    existingUser.firstName,
    resetPasswordLink
  );
  const sendEmailResult = await sendEmail(
    email,
    "Password change request",
    emailContent
  );
  if (!sendEmailResult) {
    return res.status(500).json({ error: "Email server error" });
  }

  return res.status(200).json({
    message: `A reset password email has been sent to ${email}, please check your email.`,
  });
};

/**
 * PUT api/users/password
 * @description User Reset Password
 * @param req {Object} The request
 * @param res {Object} The response
 * @returns
 */
const resetPassword: RequestHandler = async (req: Request, res: Response) => {
  const { password, confirmedPassword, token } = req.body;
  if (_.isEmpty(token)) {
    return res.status(401).json({ error: "Invalid token" });
  }

  /** Check if token is valid */
  try {
    const requestUser = await User.findOne({ resetPasswordToken: token });
    if (!requestUser) {
      return res.status(401).json({ error: "Invalid token." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }

  /** Check if all fields are entered */
  if (!password || !confirmedPassword) {
    return res.status(400).json({ error: "Please enter all required fields." });
  }

  /** Check if two passwords match */
  if (password !== confirmedPassword) {
    return res.status(400).json({
      error: "Please make sure your passwords match.",
    });
  }

  /** Check password's validation */
  const passwordValidateResult = validatePassword(password);
  if (!passwordValidateResult) {
    return res.status(400).json({
      error:
        "You must include at least 8 characters and a number/special character",
    });
  }

  /** Update database and send response */
  const hashedPassword = await hash(password);
  const updatedPassword = { password: hashedPassword };

  /** Remove token after used */
  const removeToken = { $unset: { resetPasswordToken: "" } };
  const user = { resetPasswordToken: token };
  try {
    await User.findOneAndUpdate(user, updatedPassword, { new: true });
    await User.findOneAndUpdate(user, removeToken, { new: true });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(400).send(error);
  }
};

/**
 * GET api/users/verification/email?token=
 * @description User click email verification link
 * @param req {Object} The request
 * @param res {Object} The response
 * @returns
 */
const verifyEmail: RequestHandler = async (req: Request, res: Response) => {
  const { token } = req.query;
  const tokenString = token?.toString();
  if (_.isEmpty(tokenString)) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  try {
    const user = { confirmEmailToken: tokenString };
    const existingUser = await User.findOne(user);
    if (!existingUser) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    const updateEmailVerification = { $set: { emailVerified: true } };
    await User.findOneAndUpdate(user, updateEmailVerification, { new: true });
    // find user and return user email address
    return res
      .status(201)
      .json({ email: existingUser.email, message: "Email verified." });
  } catch (error) {
    // display error message
    return res.status(500).json({ error });
  }
};

export { getUsers, signUp, sendPasswordResetLink, resetPassword, verifyEmail };
