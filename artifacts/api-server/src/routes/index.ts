import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import mediaRouter from "./media";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(mediaRouter);
router.use("/admin-api", adminRouter);

export default router;
