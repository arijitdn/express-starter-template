import cors from "cors";
import express from "express";
import path from "path";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { API_PREFIX, CURRENT_VERSION } from "./lib/config";

config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["*"];

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

console.log(`✨ Starting API Server: (${CURRENT_VERSION})`);

// Dynamically load routes
const routesPath = path.join(__dirname, "routes");
const routeFiles = readdirSync(routesPath).filter(
  (file) => file.endsWith(".ts") || file.endsWith(".js")
);

routeFiles.forEach((file) => {
  const routeName = file.split(".")[0];
  const router = require(path.join(routesPath, file)).default;
  app.use(`/${API_PREFIX}/${CURRENT_VERSION}/${routeName}`, router);
  console.log(`📂 Route loaded: /${routeName}`);
});

app.get(
  `/${API_PREFIX}/${CURRENT_VERSION}`,
  (_req: express.Request, res: express.Response) => {
    res.send("👋");
  }
);

// Error handling
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("An error occurred: ", err.stack);
    res.status(500).json({ error: "Something went wrong" });
  }
);

app.listen(PORT, () => {
  console.log(
    `✨ Server online: http://localhost:${PORT}/${API_PREFIX}/${CURRENT_VERSION}`
  );
});
