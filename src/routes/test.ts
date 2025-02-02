import { Router } from "express";

const testRouter = Router();

// http://localhost:3000/api/v1/test
testRouter.get("/", (_req, res) => {
  res.json({
    message: "Hello from test route",
  });
});

export default testRouter;
