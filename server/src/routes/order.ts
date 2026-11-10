import { Router } from "express";
import { listInventory, purchase } from "../controllers/order";
const router = Router()

router.post("/buy", purchase)
router.get("/inventory/:productId", listInventory)

export default router