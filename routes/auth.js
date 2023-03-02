import express from "express";
import authController from "../controllers/authController.js"

const router = express.Router();

router.post("/login", authController.login);
router.post("/google-oauth", authController.googleOauth);
router.get("/verify", authController.verifyEmail);

export default router;