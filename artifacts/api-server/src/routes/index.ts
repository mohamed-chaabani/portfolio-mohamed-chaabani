import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioRouter from "./portfolio";
import categoryRouter from "./categoryRouter";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/portfolio", portfolioRouter);
router.use("/portfolio/categories", categoryRouter);
router.use("/portfolio/upload", uploadRouter);

export default router;
