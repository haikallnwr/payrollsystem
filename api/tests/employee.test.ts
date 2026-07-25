import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import { clearDatabase } from "./helpers/test-db";
import { createTestUser } from "./helpers/auth.helper";

describe("Employee API Integration Tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/employees/create", () => {
    it("should allow ADMIN to create employee profile", async () => {
      const { cookieHeader } = await createTestUser({ role: "ADMIN" });

      const divRes = await request(app)
        .post("/api/divisions/create")
        .set("Cookie", cookieHeader)
        .send({ name: `Test-Dept-${Date.now()}` });

      const posRes = await request(app)
        .post("/api/jobPosition/create")
        .set("Cookie", cookieHeader)
        .send({
          division_id: divRes.body.data.id,
          position_name: "Test Developer",
          level: "JUNIOR",
          default_salary: 7000000,
        });

      const response = await request(app)
        .post("/api/employees/create")
        .set("Cookie", cookieHeader)
        .send({
          job_position_id: posRes.body.data.id,
          full_name: "Test Budi Santoso",
          join_date: "2024-01-15",
          base_salary: 8000000,
          phone: "08123456789",
        });

      expect(response.status).toBe(201);
      expect(response.body.data.full_name).toBe("Test Budi Santoso");
      expect(response.body.data.employee_code).toBeDefined();
    });

    it("should reject employee creation by EMPLOYEE role", async () => {
      const { cookieHeader } = await createTestUser({ role: "EMPLOYEE" });

      const response = await request(app)
        .post("/api/employees/create")
        .set("Cookie", cookieHeader)
        .send({
          job_position_id: 1,
          full_name: "Test Unauthorized Create",
          join_date: "2024-01-15",
          base_salary: 5000000,
        });

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/employees", () => {
    it("should return list of employees for authenticated user", async () => {
      const { cookieHeader } = await createTestUser({ role: "ADMIN", createEmployeeProfile: true });

      const response = await request(app)
        .get("/api/employees")
        .set("Cookie", cookieHeader);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});
