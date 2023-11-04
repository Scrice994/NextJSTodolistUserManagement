import express from "express";
import * as UserControllers from "../controllers/users";
import validateRequestSchema from "../middleware/validateRequestSchema";
import { logInSchema, signupSchema } from "../validation/users";
import passport from "passport";

const router = express.Router();

router.get("/find-users", UserControllers.findUsers)

router.post("/signup", validateRequestSchema(signupSchema), UserControllers.signup);

router.post("/login", passport.authenticate("local"), validateRequestSchema(logInSchema), (req, res) => res.status(200).json(req.user));

export default router;