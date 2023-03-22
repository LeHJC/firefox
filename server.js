//import goods_img_02 from "./client/src/images/goods/uniform_02.jpg";
//import goods_img_03 from "./client/src/images/goods/bat_01.jpg";
//import goods_img_01 from "./client/src/images/goods/uniform_01.jpg";

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});

const uploadDir = "./upload";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
connection.connect();

const multer = require("multer");
const upload = multer({ dest: "upload/" });

app.get("/api/product", (req, res) => {
  connection.query("SELECT * FROM product.products", (err, rows, fields) => {
    res.send(rows);
  });
});

app.use("/image", express.static("./upload"));

app.post("/api/product", upload.single("image"), (req, res) => {
  const sql = "INSERT INTO products VALUES (null, ?,?,?,?)";
  const image = "/image/" + req.body.filename;
  const name = req.body.name;
  const category = req.body.category;
  const price = req.body.price;
  const params = [image, name, category, price];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
    console.log(err);
  });
});

app.delete("/api/product/:num", (req, res) => {
  const sql = "DELETE FROM products WHERE num=?";
  const params = [req.params.num];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
