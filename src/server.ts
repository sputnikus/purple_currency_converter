import express, { Request, Response } from "express";
import path from "path";
import nunjucks = require("nunjucks");

import { convert } from "./conversion";

const app = express();
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

nunjucks.configure(path.join(__dirname, "views"), {
  autoescape: true,
  express: app,
});

app.get("/", (req: Request, res: Response) => {
  // Home page has some includes
  res.render("index.njk");
});

app.post("/conversion", (req: Request, res: Response, next) => {
  convert(req)
    .then((data) =>
      // Render partial response for HTMx replace
      res.render("partials/result_card.njk", { data: data }),
    )
    .catch(next);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
