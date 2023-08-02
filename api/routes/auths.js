import express from "express";
import { googleAuth, signin, signup } from "../controllers/auth.js";
// import {} from "../controllers/auth";
const router = express.Router();

// Sign up a user
router.post("/signup", signup);

// Sign in a user
router.post("/signin", signin);

// Google auth
router.post("/google", googleAuth);
export default router;
