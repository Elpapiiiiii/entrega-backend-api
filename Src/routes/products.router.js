import { Router } from "express";
import path from "path";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager(path.resolve("data/products.json"));

router.get("/", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.json({ status: "success", payload: products });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await pm.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: product });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await pm.addProduct(req.body);
    res.status(201).json({ status: "success", payload: created });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updated = await pm.updateProduct(req.params.pid, req.body);
    if (!updated) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const ok = await pm.deleteProduct(req.params.pid);
    if (!ok) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
