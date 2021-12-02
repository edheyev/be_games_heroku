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
        expect(response.body.msg).toEqual("Review id not found");
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
        expect(body.msg).toBe("Bad request- keys dont match");
      });
  });
  //invalid inc_votes
  it("status 404: invalid type on inc_votes", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "cats" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request- values are wrong type");
      });
  });
  //extra properties on request body
  it("status 404: extra properties on request body", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({})
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request- keys dont match");
      });
  });
});

describe("GET /api/reviews", () => {
  it("status 200: responds with array of review object sorted by date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
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
  it("status 200: accepts category query which filters based on category", () => {
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
  it("status 400: category does not exist", () => {
    return request(app)
      .get("/api/reviews?category=paper")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("INVALID category QUERY");
      });
  });
  //cat with no reviews associated
  it("status 400: category has no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children%27s+games")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No reviews Found");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("status 200: respons with array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  it("should return an empty array if no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(0);
      });
  });
  it("status 404: if review does not exist", () => {
    return request(app)
      .get("/api/reviews/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No reviews Found");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  it("status 201: accepts comment response and returns the posted comment", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "mallionaire", body: "Ooooh its reeet gut" })
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
      });
  });
  it("status 404 user does not exist", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "EdAccount", body: "Ooooh its reeet gut" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Search parameter does not exist");
      });
  });
  it("status 404 incorrect keys in req body", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "EdAccount", body: "Ooooh its reeet gut", sand: "red" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Bad request- keys dont match");
      });
  });
  it("status 404 empty req body", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({})
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Bad request- keys dont match");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("status 204 returns no content and deletes from database", () => {
    return request(app)
      .delete("/api/comments/6")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  it("status 400 comment doesnt exist", () => {
    return request(app)
      .delete("/api/comments/9999999")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Comment does not exist");
      });
  });
});

describe("GET /api/", () => {
  it("status 200 returns JSON including all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        // expect(response.body.apiDocument).toEqual({
        //   "GET /api": {
        //     description:
        //       "serves up a json representation of all the available endpoints of the api",
        //   },
        //   "GET /api/categories": {
        //     description: "serves an array of all categories",
        //     queries: [],
        //     exampleResponse: {
        //       categories: [
        //         {
        //           description:
        //             "Players attempt to uncover each other's hidden role",
        //           slug: "Social deduction",
        //         },
        //       ],
        //     },
        //   },
        //   "GET /api/reviews": {
        //     description: "serves an array of all reviews",
        //     queries: ["category", "sort_by", "order"],
        //     exampleResponse: {
        //       reviews: [
        //         {
        //           title: "One Night Ultimate Werewolf",
        //           designer: "Akihisa Okui",
        //           owner: "happyamy2016",
        //           review_img_url:
        //             "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        //           category: "hidden-roles",
        //           created_at: 1610964101251,
        //           votes: 5,
        //         },
        //       ],
        //     },
        //   },
        //   "GET /api/reviews/:review_id": {
        //     description: "returns review matching provided ID",
        //     queries: [],
        //     exampleResponse: {},
        //   },
        //   "PATCH /api/reviews/:review_id": {
        //     description: "increments votes matching ID",
        //     queries: [
        //       "owner",
        //       "title",
        //       "review_id",
        //       "review_img_url",
        //       "category",
        //       "created_at",
        //       "votes",
        //       "comment_count",
        //     ],
        //     exampleResponse: {
        //       title: "One Night Ultimate Werewolf",
        //       designer: "Akihisa Okui",
        //       owner: "happyamy2016",
        //       review_img_url:
        //         "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        //       category: "hidden-roles",
        //       created_at: 1610964101251,
        //       votes: 5,
        //     },
        //   },
        //   "GET /api/reviews/:review_id/comments": {
        //     description:
        //       "responds with array of review objects sorted by date by default",
        //     queries: [],
        //     exampleResponse: [
        //       {
        //         comment_id: 1,
        //         created_at: "DATE",
        //         votes: 10,
        //         author: "Ed",
        //         body: "game good",
        //       },
        //     ],
        //   },
        //   "POST /api/reviews/:review_id/comments": {
        //     description: "post comment to valid review specified by review_id",
        //     queries: [],
        //     exampleResponse: {
        //       comment_id: 1,
        //       created_at: "DATE",
        //       votes: 10,
        //       author: "Ed",
        //       body: "game good",
        //     },
        //   },
        //   "DELETE /api/comments/:comment_id": {
        //     description: "delete comment via comment id",
        //     queries: [],
        //     exampleResponse: {},
        //   },
        // });
      });
  });
});

describe("GET api/users", () => {
  it("status 200 returns array of objects each object should have username", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length > 0).toBe(true);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
  //
});
describe("GET api/users/:username", () => {
  it("status 200 returns user object by id with username avatar_url and name", () => {
    return request(app)
      .get("/api/users/philippaclaire9")
      .expect(200)
      .then(({ body }) => {
        expect.objectContaining({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  //user doesnt exist
  it("status 404 user does not exist", () => {
    return request(app)
      .get("/api/users/notRealUser")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
});
describe("PATCH /api/comments/:comment_id", () => {
  it("status 204  accepts vode object returns with the updated comemnt", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.comment.votes).toBe(26);
      });
    ``;
  });
});
