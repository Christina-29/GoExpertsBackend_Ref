import supertest from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import User from "../../models/users";

const request = supertest(app);

interface Global {
  __MONGO_URI__: string;
}

declare const global: Global;

describe("test user api under folder controller", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    /** delete test data from database */
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  /**
   * test user sign up and activate user email
   * */
  describe("test user sign up and activate user email", () => {
    const userInfo = {
      firstName: "Camille",
      lastName: "Chang",
      email: "test@ddd.com",
      password: "123456789q",
    };
    it("/api/users, should return 201 after user successfully signed up ", async () => {
      const res = await request.post("/api/users").send(userInfo);
      expect(res.status).toBe(201);
      /** get token from response if successful */
      expect(res.body).toHaveProperty("token");
    });

    it("/api/users, should return 400 when the same email has been registered", async () => {
      const res = await request.post("/api/users").send(userInfo);
      expect(res.status).toBe(400);
    });

    /** get user info,then uses one time token to mock user clicking email verification link */
    it("/api/users/verification/email?token=, verfiy user email ", async () => {
      const existingUser = await User.findOne({
        email: "test@ddd.com",
      }).exec();

      /** before verification  */
      const emailVerified = existingUser?.emailVerified as boolean;
      expect(emailVerified).toEqual(false);

      const confirmEmailToken = existingUser?.confirmEmailToken as string;
      const res = await request
        .get(`/api/users/verification/email?token=${confirmEmailToken}`)
        .send();

      /** after verification  */
      const updateUser = await User.findOne({
        email: "test@ddd.com",
      }).exec();
      expect(res.status).toBe(201);
      /** check if user verfication info is updated */
      expect(updateUser?.emailVerified as boolean).toEqual(true);
    });
  });

  /**
   * test reset password logic
   * */
  describe("test reset password logic", () => {
    const email = "test@ddd.com";

    it("/api/users/password-reset-link, should return 200 after existing user input their email", async () => {
      const response = await request
        .put("/api/users/password-reset-link")
        .send({ email });
      expect(response.status).toBe(200);

      const existingUser = await User.findOne({
        email,
      }).exec();
      expect(existingUser?.email).toEqual(email);
    });

    it("/api/users/password-reset-link, should return 401 when email related account does not exist", async () => {
      const res = await request
        .put("/api/users/password-reset-link")
        .send({ email: "test2@dd.com" });
      expect(res.status).toBe(401);
    });

    /** get user info,then uses token to mock user clicking activate user account */
    it("/api/users/password, should return 200 after user input new password", async () => {
      const existingUser = await User.findOne({
        email,
      }).exec();

      const resetPasswordToken = existingUser?.resetPasswordToken as string;
      const body = {
        password: "asdfghjkl1",
        confirmedPassword: "asdfghjkl1",
        token: resetPasswordToken,
      };
      const res = await request.put("/api/users/password").send(body);
      expect(res.status).toBe(200);
    });
  });
});
