import express from "express";
import { getUsers, Register, Login, Logout, getPeople, deletePeople, editPeople, addPeople } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.get("/people", verifyToken, getPeople);
router.delete("/people/:id", verifyToken, deletePeople);
router.put("/people/:id", verifyToken, editPeople);
router.post("/people", verifyToken, addPeople);

export default router;