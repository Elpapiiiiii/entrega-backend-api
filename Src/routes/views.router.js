import { Router } from "express";
import path from "path";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager(path.resolve("data/products.json"));

router.get("/", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.render("home", { products });
  } catch (err) {
    res.status(500).send("Error al cargar la vista home");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.render("realTimeProducts", { products });
  } catch (err) {
    res.status(500).send("Error al cargar la vista realtime");
  }
});

export default router;