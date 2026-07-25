import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import { clearDatabase } from "./helpers/test-db";
import { createTestUser } from "./helpers/auth.helper";

describe("Reimbursement API Integration Tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/reimbursements/create", () => {
    it("should allow employee to submit reimbursement request", async () => {
      const emp = await createTestUser({ role: "EMPLOYEE" });

      const response = await request(app)
        .post("/api/reimbursements/create")
        .set("Cookie", emp.cookieHeader)
        .send({
          employee_id: emp.employee!.id,
          title: "Test Medical Receipt",
          amount: 250000,
          description: "Doctor visit & prescription",
        });

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe("Test Medical Receipt");
      expect(response.body.data.status).toBe("PENDING");
    });
  });

  describe("PUT /api/reimbursements/approve/:id", () => {
    it("should allow ADMIN to approve reimbursement", async () => {
      const admin = await createTestUser({ role: "ADMIN" });
      const emp = await createTestUser({ role: "EMPLOYEE" });

      const createRes = await request(app)
        .post("/api/reimbursements/create")
        .set("Cookie", emp.cookieHeader)
        .send({
          employee_id: emp.employee!.id,
          title: "Test Office Supplies",
          amount: 150000,
        });

      const reimburseId = createRes.body.data.id;

      const approveRes = await request(app)
        .put(`/api/reimbursements/approve/${reimburseId}`)
        .set("Cookie", admin.cookieHeader)
        .send({ status: "APPROVED" });

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.data.status).toBe("APPROVED");
    });

    it("should DISALLOW HR from approving their own reimbursement request", async () => {
      const hrUser = await createTestUser({ role: "HR" });

      const createRes = await request(app)
        .post("/api/reimbursements/create")
        .set("Cookie", hrUser.cookieHeader)
        .send({
          employee_id: hrUser.employee!.id,
          title: "Test Travel Expense",
          amount: 500000,
        });

      const reimburseId = createRes.body.data.id;

      const approveRes = await request(app)
        .put(`/api/reimbursements/approve/${reimburseId}`)
        .set("Cookie", hrUser.cookieHeader)
        .send({ status: "APPROVED" });

      expect(approveRes.status).toBe(403);
      expect(approveRes.body.message).toContain("cannot approve your own reimbursement");
    });
  });
});
