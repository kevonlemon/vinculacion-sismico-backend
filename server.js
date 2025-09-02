import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./lib/routes/authRouter.js";
import userRouter from "./lib/routes/userRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors("*"));

app.listen(PORT, () => {
  console.log(`\nServer started at ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Buenas :D");
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
