import { Router } from "express";
import path from "path";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

const cm = new CartManager(path.resolve("data/carts.json"));
const pm = new ProductManager(path.resolve("data/products.json"));

router.post("/", async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: cart.products });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const product = await pm.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", error: "Producto no existe" });
    }

    const updatedCart = await cm.addProductToCart(cid, product.id);
    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: updatedCart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
