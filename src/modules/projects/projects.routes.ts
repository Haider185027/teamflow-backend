import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create, list } from "./projects.controller";

const router = Router();

router.use(authenticate);

router.post("/", create);
router.get("/", list);

export default router;
