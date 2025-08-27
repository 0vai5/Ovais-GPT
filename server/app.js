import express from "express";
import cors from "cors";
import env from "./config/env.js";
import messageRouter from "./routes/message.routes.js";

const app = express();
const PORT = env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Ovais-GPT Server is running");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
