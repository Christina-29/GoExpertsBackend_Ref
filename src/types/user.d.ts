export interface IUser {
  userID: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: number;
  address?: string;
  avatar?: string;
  entryDate: Date;
  role: string;
  resetPasswordToken?: string;
  confirmEmailToken?: string;
  emailVerified: boolean;
}