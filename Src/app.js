import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Guardamos io para usarlo en routers HTTP
app.set("io", io);

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// WebSocket
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  try {
    // Import dinámico para reutilizar tu manager actual
    const { default: ProductManager } = await import("./managers/ProductManager.js");
    const pm = new ProductManager(path.resolve("data/products.json"));
    const products = await pm.getProducts();

    socket.emit("updateProducts", products);
  } catch (error) {
    console.error("Error al cargar productos por socket:", error.message);
  }

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

httpServer.listen(8080, () => {
  console.log("Servidor escuchando en http://localhost:8080");
});