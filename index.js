const express = require("express");
const app = express();
const port = 3000;
const expressHbs = require("express-handlebars");
const { createPagination } = require("express-handlebars-paginate");

app.use(express.static(__dirname + "/html"));
app.engine(
  "hbs",
  expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: "layout",
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      createPagination,
      formatDate: (date) => {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      showIndex: (index) => index + 1,
      totalPagesArray: (totalPages) => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      },
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      eq: (a, b) => a === b,
      gt: (a, b) => a > b,
      lt: (a, b) => a < b,
      appendKeyword: (keyword, page) => {
        return keyword ? `?keyword=${keyword}&page=${page}` : `?page=${page}`;
      },
    },
  })
);
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.redirect("/users"));
app.use("/users", require("./routes/userRouter"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
