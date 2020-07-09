const assert = require("assert");
const server = require("../app");
const request = require("supertest");
const { decodeJWT, createToken } = require("./helper");

require("dotenv").config();

const { API_KEY } = process.env;

// Fake user and token (real)
const FAKE_USER = "user@test.com";
const FAKE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJAdGVzdC5jb20ifQ.c9i-82vqIMQtgzLG1t6Q_57CzC2knFXBM7r_5YOInaE";

const FAKE_TOKEN_INVALID = "this_is_not_real_token";
const FAKE_TOKEN_NOT_VALID_USER = createToken("invalid@user.com");

describe("GUEST", () => {
  // Test invalid api_key (401 expected)
  it("Test api key | POST /login", done => {
    const username = FAKE_USER;
    const password = FAKE_USER;

    return request(server)
      .post("/login")
      .set("api_key", `${API_KEY}_altered`)
      .send({
        username: username,
        password: password,
      })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  // Test login authorized user (200, valid token expected)
  it("Login - check token decode | POST /login", done => {
    const username = FAKE_USER;
    const password = FAKE_USER;

    return request(server)
      .post("/login")
      .set("api_key", API_KEY)
      .send({
        username: username,
        password: password,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        //    Validate token username
        const decodedUsername =
          res.body && res.body.auth && decodeJWT(res.body.auth.token);
        assert.equal(decodedUsername, username);
        return done();
      });
  });
});

describe("USER", () => {
  // Real user (200 expected)
  it("Valid token (200 expected) | GET /user", done => {
    return request(server)
      .get("/user")
      .set("api_key", API_KEY)
      .set("Authorization", `Bearer ${FAKE_TOKEN}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const username = res.body && res.body.username;
        assert.equal(username, FAKE_USER);
        return done();
      });
  });

  // Invalid token (401 expected)
  it("Invalid token (401 expected) | GET /user", done => {
    return request(server)
      .get("/user")
      .set("api_key", API_KEY)
      .set("Authorization", `Bearer ${FAKE_TOKEN_INVALID}`)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  // Valid token, invalid user (200, null body expected)
  it("Valid token, user not exit (200, null expected) | GET /user", done => {
    return request(server)
      .get("/user")
      .set("api_key", API_KEY)
      .set("Authorization", `Bearer ${FAKE_TOKEN_NOT_VALID_USER}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.body, null);
        return done();
      });
  });
});
