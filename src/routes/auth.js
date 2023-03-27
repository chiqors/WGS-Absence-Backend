import express from "express";
import authController from "../controllers/authController.js"

const router = express.Router();

router.get("/auth/:id", authController.getAuthById);
router.post("/login", authController.login);
router.get("/verify", authController.verifyEmail);
router.post("/oauth/google/login", authController.googleOauth);
router.post("/oauth/google/link", authController.googleOauthLink);
router.post("/oauth/google/unlink", authController.googleOauthUnlink);
router.get("/oauth/google/get/:employee_id", authController.googleOauthData);


export default router;