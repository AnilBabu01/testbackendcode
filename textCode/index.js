const express = require("express");
const connectdb = require("./db");
const cors = require("cors");
const port = 8080;
connectdb();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", require("./route/auth"));

app.listen(port, () => {
  console.log(`server is runing on http://localhost:${port}`);
});
