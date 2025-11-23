import express from "express";
import routes from "./routes";
const app = express();

// app.set("view engine", "ejs");
// app.set("views", "./src/views");

app.use(express.json()).use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(routes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    const errorCode = err.code || "INTERNAL_SERVER_ERROR";
    res.status(status).json({ message, error: errorCode });
  }
);

export default app;
