/**
 * Validate password strength
 * @param password password to be validate
 * @returns validation result
 */
const validatePassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*[\d@$~!%*^#?&+_-])[A-Za-z\d@$~!%*^#?&+_-]{8,32}$/;
  const passwordValidataResult = passwordRegex.test(password);
  return passwordValidataResult;
};

/**
 * Validate email format
 * @param email email to be validate
 * @returns validation result
 */
const validateEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const emailValidateResult = emailRegex.test(email);
  return emailValidateResult;
};

export { validatePassword, validateEmail };
