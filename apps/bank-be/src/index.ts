import express from "express";
import userRouter from "./routes/user.route";
import dbConnect from "./db";

const app = express();
app.use(express.json());
app.use("/api", userRouter);

const PORT = process.env.PORT || 3000;

dbConnect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
