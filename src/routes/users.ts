import express from "express";
import * as UserControllers from "../controllers/users";
import validateRequestSchema from "../middleware/validateRequestSchema";
import { logInSchema, signupSchema } from "../validation/users";
import passport from "passport";
import { requiresAuth } from "../middleware/requiresAuth";
import env from "../env";

const router = express.Router();

router.get("/me", requiresAuth, UserControllers.getAuthenticatedUser);

router.post("/signup", validateRequestSchema(signupSchema), UserControllers.signup);

router.post("/login", passport.authenticate("local"), validateRequestSchema(logInSchema), UserControllers.login);

router.get("/login/google", passport.authenticate('google'));

router.get("/oauth2/redirect/google", passport.authenticate('google', {
    successRedirect: env.WEBSITE_URL + "/todolist",
    failureRedirect : env.WEBSITE_URL + '/',
    keepSessionInfo: true
}));

router.get("/account-verification", UserControllers.accountVerification)

router.get("/get-authorization", requiresAuth, UserControllers.getAuthorization);

router.post("/logout", requiresAuth, UserControllers.logout);

export default router;