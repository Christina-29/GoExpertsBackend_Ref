import bcrypt from "bcryptjs";

/**
 * Hash string
 * @param s string to hash
 * @returns Promise with hashed string
 */
const hash = async (s: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashedString = await bcrypt.hash(s, salt);
  return hashedString;
};

/**
 * Compare string with hashed string
 * @param string string to compare
 * @param hashedString hashed string to be compared to
 * @returns Promise with compared result
 */
const compare = async (
  string: string,
  hashedString: string
): Promise<boolean> => {
  const compareResult = await bcrypt.compare(string, hashedString);
  return compareResult;
};

export { hash, compare };
