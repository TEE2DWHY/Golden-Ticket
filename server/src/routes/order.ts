import { Router } from "express";
import { getInventory, getProduct, purchase } from "../controllers/order";
const router = Router()

router.post("/buy", purchase)
router.get("/inventory", getInventory)
router.get("/inventory/:productId", getProduct)

export default router