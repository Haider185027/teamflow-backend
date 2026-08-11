import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create, list, update, remove } from "./tasks.controller";

const router = Router();

router.use(authenticate);

router.post("/", create);
router.get("/", list);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
