const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();
var cors = require("cors");
const dbConn = require("./config/connection");
const homeRouter = require("./routers/home");
const restRouter = require("./routers/rest");
const userRouter = require("./routers/user");
const menuRouter = require("./routers/menu");
const orderRouter = require("./routers/order");
const paymentRouter = require("./routers/payment");
const adminRouter = require("./routers/admin");
const feedbackRouter = require("./routers/feedback");
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/", homeRouter);
app.use("/api/rest", restRouter);
app.use("/api/user", userRouter);
app.use("/api/menu", menuRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/feedback", feedbackRouter);

app.listen(9000, function () {
  console.log("node app is running on 9000");
}); //listen at PORT 9000
