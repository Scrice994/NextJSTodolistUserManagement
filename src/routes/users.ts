import express from "express";
import * as UserControllers from "../controllers/users";
import validateRequestSchema from "../middleware/validateRequestSchema";
import { logInSchema, signupSchema } from "../validation/users";
import passport from "passport";
import { requiresAuthen } from "../middleware/requiresAuthen";
import env from "../env";
import { requiresAutho } from "../middleware/requiresAutho";

const router = express.Router();

router.get("/me", requiresAuthen, UserControllers.getAuthenticatedUser);

router.post("/signup", validateRequestSchema(signupSchema), UserControllers.signup);

router.post("/login", passport.authenticate("local", { failWithError: true, failureMessage: true }), validateRequestSchema(logInSchema), UserControllers.login, UserControllers.loginError);

router.get("/login/google", passport.authenticate('google'));

router.get("/oauth2/redirect/google", passport.authenticate('google', {
    successRedirect: env.WEBSITE_URL + "/todolist",
    failureRedirect : env.WEBSITE_URL + '/',
    keepSessionInfo: true
}));

router.put("/change-username", requiresAuthen, UserControllers.changeUsername);

router.post("/send-verification-email", UserControllers.sendVerificationEmail);

router.get("/account-verification", UserControllers.accountVerification);

router.post("/group/create-member-account", requiresAuthen, requiresAutho, UserControllers.createNewGroupMember);

router.post("/logout", requiresAuthen, UserControllers.logout);

export default router;