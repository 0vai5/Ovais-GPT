import { Router } from "express";
import {answerQuestion} from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.post("/answer", answerQuestion);

export default messageRouter;
