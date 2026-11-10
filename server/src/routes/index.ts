import { Router } from "express";
import orderRoute from "./order";
const router = Router()


router.use("/api/v1", orderRoute)

export default router;