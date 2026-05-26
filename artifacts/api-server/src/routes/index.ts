import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import mediaRouter from "./media";
import adminRouter from "./admin";

const router: IRouter = Router();

// routes بدون /api — لأن /api موجودة في app.ts
router.use(healthRouter);
router.use(storageRouter);
router.use(mediaRouter);
router.use("/admin", adminRouter);

export default router;
