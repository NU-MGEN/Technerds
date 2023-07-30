/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const openAiRoutes = require("./routes/openAI");

const app = express();
const port = 7912;

app.use(bodyParser.json());
app.use(cors());

app.use("/openAI", openAiRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
