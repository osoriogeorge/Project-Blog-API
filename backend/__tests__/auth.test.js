const request = require("supertest");
const app = require("../src/server");

describe("POST /api/auth/register", () => {
  it("should return 400 Bad Request for invalid registration data (short username)", async () => {
    const registrationData = {
      username: "ab",
      password: "password123",
    };
    const res = await request(app)
      .post("/api/auth/register")
      .send(registrationData);

    console.log("Response body:", res.body); // Imprime siempre el cuerpo de la respuesta
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(
      res.body.errors.some(
        (error) => error.param === "username" || error.path === "username"
      )
    ).toBe(true);
  });
});
