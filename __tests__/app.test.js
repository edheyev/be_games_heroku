const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  it("status 200: should access cats and return array containing slug and descriptions", () => {
    return request(app)
      .get("/api/categories/")
      .expect(200)
      .then((response) => {
        expect(response.body.categories.length > 0);
        response.body.categories.forEach((cat) => {
          expect(cat).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("status 200: returns review object ", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length > 0);
        response.body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  it("status 404: incorrect game id", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("review id not found");
      });
  });
  //404 not found for incorrect game id
  it("status 404: bad request", () => {
    return request(app)
      .get("/api/reviews/doggy")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Invalid Request");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  it("status 204: increments votes and returns updated review", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedReview).toEqual({
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: expect.any(String),
          votes: 11,
          review_id: 1,
        });
      });
  });
  //errors
  //no inc votes on request body
  it("status 404: no inc votes on request body", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({})
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("bad patch request- keys dont match");
      });
  });
  //invalid inc_votes
  it("status 404: invalid type on inc_votes", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "cats" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("bad patch request- values are wrong type");
      });
  });
  //extra properties on request body
  it("status 404: extra properties on request body", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({})
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("bad patch request- keys dont match");
      });
  });
});

describe("GET /api/reviews", () => {
  it("status 200: responds with array of review object sorted by date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        // console.log(body.reviews);
        expect(body.reviews.length > 0).toBe(true);
        expect(body.reviews).toBeSortedBy("created_at");
        body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  it("status 200: can be sorted by other things", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        // console.log(body.reviews);
        expect(body.reviews.length > 0).toBe(true);
        expect(body.reviews).toBeSortedBy("votes");
      });
  });
  it("status 200: can be sorted by other things DESCENDING", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=DESC")
      .expect(200)
      .then(({ body }) => {
        // console.log(body.reviews);
        expect(body.reviews.length > 0).toBe(true);
        expect(body.reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  it.only("status 200: accepts category query which filters based on category", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=DESC&category=dexterity")
      .expect(200)
      .then(({ body }) => {
        // console.log(body.reviews);
        expect(body.reviews.length > 0).toBe(true);
        expect(body.reviews).toBeSortedBy("votes", {
          descending: true,
        });
        body.reviews.forEach((review) => {
          expect(review.category).toEqual("dexterity");
        });
      });
  });
  //bad sort by col
  it("status 400: bad sort by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=frogs")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("INVALID sort_by QUERY");
      });
  });
  //bad order
  it("status 400: bad order query", () => {
    return request(app)
      .get("/api/reviews?order=GWA")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("INVALID order QUERY");
      });
  });
  //bad cat
  it("status 400: category", () => {
    return request(app)
      .get("/api/reviews?category=paper")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("INVALID category QUERY");
      });
  });
  //cat with no reviews associated
  it.only("status 400: category has no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children%27s+games")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("category has no reviews");
      });
  });
});

// GET /api/reviews/:review_id/comments
// POST /api/reviews/:review_id/comments
// DELETE /api/comments/:comment_id
// GET /api
