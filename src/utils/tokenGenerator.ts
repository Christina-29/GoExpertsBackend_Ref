import { randomBytes } from "crypto";

/**
 * Generate a random token
 * @returns generated token
 */
const generateToken = (): string => randomBytes(30).toString("hex");

export default generateToken;
