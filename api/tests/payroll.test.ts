import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import { clearDatabase } from "./helpers/test-db";
import { createTestUser } from "./helpers/auth.helper";

describe("Payroll API Integration Tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/payrolls/generate & /generate-batch", () => {
    it("should allow ADMIN to generate single payroll for an employee", async () => {
      const admin = await createTestUser({ role: "ADMIN" });
      const emp = await createTestUser({ role: "EMPLOYEE", fullName: "Test John Payroll" });

      const response = await request(app)
        .post("/api/payrolls/generate")
        .set("Cookie", admin.cookieHeader)
        .send({
          employee_id: emp.employee!.id,
          month: 7,
          year: 2026,
          tax_percentage: 5,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.employee_id).toBe(emp.employee!.id);
      expect(response.body.data.status).toBe("DRAFT");
    });

    it("should allow ADMIN to generate batch payroll for active employees", async () => {
      const admin = await createTestUser({ role: "ADMIN" });
      await createTestUser({ role: "EMPLOYEE", fullName: "Test Emp 1" });
      await createTestUser({ role: "EMPLOYEE", fullName: "Test Emp 2" });

      const response = await request(app)
        .post("/api/payrolls/generate-batch")
        .set("Cookie", admin.cookieHeader)
        .send({
          month: 7,
          year: 2026,
          tax_percentage: 5,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.createdCount).toBeGreaterThan(0);
    });
  });

  describe("PUT /api/payrolls/status/:id (Single Status Update)", () => {
    it("should allow ADMIN to update payroll status from DRAFT to APPROVED", async () => {
      const admin = await createTestUser({ role: "ADMIN" });
      const emp = await createTestUser({ role: "EMPLOYEE" });

      const genRes = await request(app)
        .post("/api/payrolls/generate")
        .set("Cookie", admin.cookieHeader)
        .send({
          employee_id: emp.employee!.id,
          month: 7,
          year: 2026,
          tax_percentage: 5,
        });

      const payrollId = genRes.body.data.id;

      const statusRes = await request(app)
        .put(`/api/payrolls/status/${payrollId}`)
        .set("Cookie", admin.cookieHeader)
        .send({ status: "APPROVED" });

      expect(statusRes.status).toBe(200);
      expect(statusRes.body.data.status).toBe("APPROVED");
    });

    it("should DISALLOW HR from updating status of their OWN payroll (HR Self-Processing Rule)", async () => {
      const admin = await createTestUser({ role: "ADMIN" });
      const hrUser = await createTestUser({ role: "HR", fullName: "Test HR Officer" });

      const genRes = await request(app)
        .post("/api/payrolls/generate")
        .set("Cookie", admin.cookieHeader)
        .send({
          employee_id: hrUser.employee!.id,
          month: 7,
          year: 2026,
          tax_percentage: 5,
        });

      const payrollId = genRes.body.data.id;

      const updateRes = await request(app)
        .put(`/api/payrolls/status/${payrollId}`)
        .set("Cookie", hrUser.cookieHeader)
        .send({ status: "APPROVED" });

      expect(updateRes.status).toBe(403);
      expect(updateRes.body.message).toContain("HR users cannot approve, reject, or update status for their own payroll");
    });
  });

  describe("PATCH /api/payrolls/bulk-status (Bulk Status Update)", () => {
    it("should allow ADMIN to update status for multiple payrolls simultaneously", async () => {
      const admin = await createTestUser({ role: "ADMIN" });
      const emp1 = await createTestUser({ role: "EMPLOYEE", fullName: "Test Emp 1" });
      const emp2 = await createTestUser({ role: "EMPLOYEE", fullName: "Test Emp 2" });

      const p1 = await request(app)
        .post("/api/payrolls/generate")
        .set("Cookie", admin.cookieHeader)
        .send({ employee_id: emp1.employee!.id, month: 7, year: 2026, tax_percentage: 5 });

      const p2 = await request(app)
        .post("/api/payrolls/generate")
        .set("Cookie", admin.cookieHeader)
        .send({ employee_id: emp2.employee!.id, month: 7, year: 2026, tax_percentage: 5 });

      const bulkRes = await request(app)
        .patch("/api/payrolls/bulk-status")
        .set("Cookie", admin.cookieHeader)
        .send({
          payroll_ids: [p1.body.data.id, p2.body.data.id],
          status: "APPROVED",
        });

      expect(bulkRes.status).toBe(200);
      expect(bulkRes.body.data.updatedCount).toBe(2);
    });
  });
});
