import { Request, Response, NextFunction } from "express";

export const home = (req: Request, res: Response, next: NextFunction) => {
  // Passing data from request to the view
  res.render("index", {
    title: "Home Page",
    message: "Welcome to the Home Page!",
  });
};

export const about = (req: Request, res: Response, next: NextFunction) => {
  res.render("about", {
    title: "About Page",
    users: [
      { name: "Alice", age: 18 },
      { name: "Bob", age: 20 },
      { name: "Charlie", age: 29 },
    ],
  });
};
