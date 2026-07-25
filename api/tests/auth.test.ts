import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import { clearDatabase } from "./helpers/test-db";
import { createTestUser } from "./helpers/auth.helper";

describe("Authentication & User API Integration Tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/users/login", () => {
    it("should login successfully with valid credentials and return token cookie", async () => {
      const { user, rawPassword } = await createTestUser({
        email: `test.admin.${Date.now()}@example.com`,
        role: "ADMIN",
      });

      const response = await request(app)
        .post("/api/users/login")
        .send({
          email: user.email,
          password: rawPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.message).toContain("successful");

      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      const cookieList = Array.isArray(cookies) ? cookies : [String(cookies)];
      expect(cookieList.some((c: string) => c.includes("token="))).toBe(true);
    });

    it("should fail login with incorrect password", async () => {
      const { user } = await createTestUser({ email: `test.wrongpass.${Date.now()}@example.com` });

      const response = await request(app)
        .post("/api/users/login")
        .send({
          email: user.email,
          password: "WrongPassword123!",
        });

      expect(response.status).toBe(401);
    });

    it("should fail login when user does not exist", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({
          email: "test.nonexistent@example.com",
          password: "Password123!",
        });

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/users/me", () => {
    it("should return user details when authenticated", async () => {
      const { cookieHeader } = await createTestUser({
        email: `test.me.${Date.now()}@example.com`,
        role: "ADMIN",
      });

      const response = await request(app)
        .get("/api/users/me")
        .set("Cookie", cookieHeader);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.role).toBe("ADMIN");
    });

    it("should reject request without authentication cookie", async () => {
      const response = await request(app).get("/api/users/me");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/users/register (Admin restricted)", () => {
    it("should allow ADMIN to register a new user", async () => {
      const { cookieHeader } = await createTestUser({ role: "ADMIN" });
      const newEmail = `test.newstaff.${Date.now()}@example.com`;

      const response = await request(app)
        .post("/api/users/register")
        .set("Cookie", cookieHeader)
        .send({
          email: newEmail,
          password: "Password123!",
          role: "EMPLOYEE",
        });

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe(newEmail);
    });

    it("should disallow EMPLOYEE from registering new users", async () => {
      const { cookieHeader } = await createTestUser({ role: "EMPLOYEE" });

      const response = await request(app)
        .post("/api/users/register")
        .set("Cookie", cookieHeader)
        .send({
          email: `test.hacker.${Date.now()}@example.com`,
          password: "Password123!",
          role: "ADMIN",
        });

      expect(response.status).toBe(403);
    });
  });

  describe("POST /api/users/logout", () => {
    it("should clear auth cookie on logout", async () => {
      const { cookieHeader } = await createTestUser({ role: "ADMIN" });

      const response = await request(app)
        .post("/api/users/logout")
        .set("Cookie", cookieHeader);

      expect(response.status).toBe(200);
      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
    });
  });
});
