import supertest from "supertest";
import jwt, { Secret } from "jsonwebtoken";
import mongoose from "mongoose";
import { JwtPayload } from "../utils/jwtService";
import app from "../app";

const email = "yongruipan@email.com";
const password = "asdfghjkl1!";
const firstName = "yongrui";
const lastName = "pan";

const tokenSecret = process.env.JWT_SECRET as Secret;
const request = supertest(app);

interface Global {
  __MONGO_URI__: string;
}

declare const global: Global;

describe('/api/token', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
    await request.post("/api/users").send({
      email,
      password,
      firstName,
      lastName,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });


  describe("Create", () => {
    it("should create a new JWT when email and password are correct", async () => {
      const res = await supertest(app).post("/api/token").send({
        email,
        password,
      });

      const { token } = res.body;
      const user = await (<JwtPayload>jwt.verify(token, tokenSecret));
      expect(res.statusCode).toEqual(200);
      expect(user.role).toEqual("client");
    });

    // edge cases
    it.each`
      field          | value
      ${'password'}  | ${undefined}
      ${'email'}     | ${undefined}
      ${'password'}  | ${'InvalidPassword'}
      ${'password'}  | ${'WrongPassword1'}
      ${'email'}     | ${'invalidEmail'}
      ${'email'}     | ${'WrongEmail@email.com'}
    `('should return 401 when $field is $value', async ({ field, value }) => {
      const validUser = {
        email,
        password
      };
      const payload = { ...validUser, [field]: value };

      const res = await request
        .post('/api/token')
        .send(payload)
      
      expect(res.statusCode).toBe(401);
    });
  });
})