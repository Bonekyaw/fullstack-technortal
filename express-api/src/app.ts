import express from "express";
import routes from "./routes";
import { limiter } from "./middleware/rateLimiter";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// app.set("view engine", "ejs");
// app.set("views", "./src/views");

var whitelist = ["http://example1.com", "http://localhost:5173"];
var corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void,
  ) {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or authorization header
};

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(cors(corsOptions))
  .use(cookieParser())
  .use(helmet())
  .use(compression())
  .use(limiter);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

app.use(express.static("public"));
app.use(express.static("upload"));

app.use(routes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    const errorCode = err.code || "INTERNAL_SERVER_ERROR";
    res.status(status).json({ message, error: errorCode });
  },
);

export default app;
