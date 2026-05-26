import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import mediaRouter from "./media";
import adminRouter from "./admin";

const router: IRouter = Router();

// كل الـ routes هتبقى تحت /api
router.use("/api", healthRouter);
router.use("/api", storageRouter);
router.use("/api", mediaRouter);

// admin بس ليه prefix خاص
router.use("/api/admin-api", adminRouter);

export default router;
