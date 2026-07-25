import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import { clearDatabase } from "./helpers/test-db";
import { createTestUser } from "./helpers/auth.helper";

describe("Division API Integration Tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/divisions/create", () => {
    it("should allow ADMIN to create a new division", async () => {
      const { cookieHeader } = await createTestUser({ role: "ADMIN" });
      const divName = `Test-Dept-${Date.now()}`;

      const response = await request(app)
        .post("/api/divisions/create")
        .set("Cookie", cookieHeader)
        .send({
          name: divName,
          description: "Software Development Division",
        });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(divName);
    });

    it("should disallow EMPLOYEE from creating a division", async () => {
      const { cookieHeader } = await createTestUser({ role: "EMPLOYEE" });

      const response = await request(app)
        .post("/api/divisions/create")
        .set("Cookie", cookieHeader)
        .send({
          name: `Test-Dept-${Date.now()}`,
        });

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/divisions", () => {
    it("should list all active divisions for authenticated user", async () => {
      const { cookieHeader } = await createTestUser({ role: "ADMIN" });
      const divName = `Test-Dept-${Date.now()}`;

      await request(app)
        .post("/api/divisions/create")
        .set("Cookie", cookieHeader)
        .send({ name: divName });

      const response = await request(app)
        .get("/api/divisions")
        .set("Cookie", cookieHeader);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.some((d: any) => d.name === divName)).toBe(true);
    });
  });

  describe("PUT /api/divisions/update/:id", () => {
    it("should allow ADMIN to update division details", async () => {
      const { cookieHeader } = await createTestUser({ role: "ADMIN" });

      const createRes = await request(app)
        .post("/api/divisions/create")
        .set("Cookie", cookieHeader)
        .send({ name: `Test-Dept-${Date.now()}` });

      const divisionId = createRes.body.data.id;
      const updatedName = `Test-Dept-Updated-${Date.now()}`;

      const updateRes = await request(app)
        .put(`/api/divisions/update/${divisionId}`)
        .set("Cookie", cookieHeader)
        .send({ name: updatedName, description: "Updated description" });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.name).toBe(updatedName);
    });
  });

  describe("DELETE /api/divisions/delete/:id", () => {
    it("should soft delete division", async () => {
      const { cookieHeader } = await createTestUser({ role: "ADMIN" });

      const createRes = await request(app)
        .post("/api/divisions/create")
        .set("Cookie", cookieHeader)
        .send({ name: `Test-Dept-${Date.now()}` });

      const divisionId = createRes.body.data.id;

      const deleteRes = await request(app)
        .delete(`/api/divisions/delete/${divisionId}`)
        .set("Cookie", cookieHeader);

      expect(deleteRes.status).toBe(200);
    });
  });
});
