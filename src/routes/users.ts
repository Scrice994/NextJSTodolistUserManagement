import express from "express";
import * as UserControllers from "../controllers/users";

const router = express.Router();

router.get("/find-users", UserControllers.findUsers)

router.post("/signup", UserControllers.signup)

export default router;