import { Request, Response } from "express";
import User from "../models/users";
import { compare } from "../utils/encryptor";
import { jwtSign } from "../utils/jwtService";
import { validateEmail, validatePassword } from "../utils/validator";

/**
 * POST api/token
 * @description User login. Validate user by email and password, if the email and password are correct, return generated JWT
 * @param req {Object} The request
 * @param res {Object} The response
 * @returns
 */
const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const passwordValidataResult = validatePassword(password);
  if (!passwordValidataResult) {
    return res.status(401).json({
      err: "You must include at least 8 characters and a number/special character",
    });
  }

  const emailValidateResult = validateEmail(email);
  if (!emailValidateResult) {
    return res.status(401).json({
      err: "The email address is invalid",
    });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(401).send({ err: "Invalid email or password" });

  const validPassword = await compare(password, user.password);
  if (!validPassword)
    return res.status(401).send({ err: "Invalid email or password" });

  const token = jwtSign({
    id: user.userID,
    role: user.role,
  });

  return res.status(200).json({ token, user });
};

export default login;
