import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import { clearDatabase } from "./helpers/test-db";
import { createTestUser } from "./helpers/auth.helper";

describe("Overtime API Integration Tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/overtimes/create", () => {
    it("should allow ADMIN to log overtime for an employee with integer hours", async () => {
      const admin = await createTestUser({ role: "ADMIN" });
      const emp = await createTestUser({ role: "EMPLOYEE", fullName: "Test Overtime Staff" });

      const response = await request(app)
        .post("/api/overtimes/create")
        .set("Cookie", admin.cookieHeader)
        .send({
          employee_id: emp.employee!.id,
          date: "2026-07-25",
          hours: 3,
          notes: "Late night deployment test",
        });

      expect(response.status).toBe(201);
      expect(response.body.data.hours).toBe(3);
      expect(response.body.data.amount).toBe(150000);
    });

    it("should reject non-integer hours (e.g., 2.5) due to Integer validation rule", async () => {
      const admin = await createTestUser({ role: "ADMIN" });
      const emp = await createTestUser({ role: "EMPLOYEE" });

      const response = await request(app)
        .post("/api/overtimes/create")
        .set("Cookie", admin.cookieHeader)
        .send({
          employee_id: emp.employee!.id,
          date: "2026-07-25",
          hours: 2.5,
          notes: "Decimal hours test",
        });

      expect(response.status).toBe(400);
    });

    it("should disallow HR from creating overtime for themselves (HR Self-Processing Rule)", async () => {
      const hrUser = await createTestUser({ role: "HR", fullName: "Test HR Officer" });

      const response = await request(app)
        .post("/api/overtimes/create")
        .set("Cookie", hrUser.cookieHeader)
        .send({
          employee_id: hrUser.employee!.id,
          date: "2026-07-25",
          hours: 2,
          notes: "HR self overtime test attempt",
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain("cannot process your own overtime");
    });
  });

  describe("GET /api/overtimes", () => {
    it("should return overtime records for authenticated admin/hr", async () => {
      const admin = await createTestUser({ role: "ADMIN" });

      const response = await request(app)
        .get("/api/overtimes")
        .set("Cookie", admin.cookieHeader);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
