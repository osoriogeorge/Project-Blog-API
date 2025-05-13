const request = require("supertest");
const app = require("../src/server");

describe("GET /api/posts", () => {
  it("should return 200 OK and an array of posts", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true); // Ajusta si tu estructura es diferente
  });
});
