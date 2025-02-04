import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { ProductType } from "./utils/types";
import { ProductRepository } from "./repository/ProductRepository";
import errorHandler from "./utils/errorHandler"; // Importa el middleware
import { PORT } from "./utils/config";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/inventory", async (req: Request, res: Response) => {
  const products = await ProductRepository.getAll();
  res.status(200).json({
    message: "Products get successfully",
    data: products,
  });
});

app.get(
  "/inventory/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const productFound = await ProductRepository.getOne(id);
      res.status(200).json({
        message: "Product get successfully",
        data: productFound,
      });
    } catch (error) {
      next(error); // Pasa el error al middleware
    }
  }
);

app.post(
  "/inventory",
  async (req: Request, res: Response, next: NextFunction) => {
    const newProduct: Omit<ProductType, "_id" | "date"> = req.body;

    try {
      const { _id } = await ProductRepository.create(newProduct);
      res.status(200).json({
        message: "Product added successfully",
        data: _id,
      });
    } catch (error) {
      next(error); // Pasa el error al middleware
    }
  }
);

app.put(
  "/inventory/:_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    try {
      const newProduct: Omit<ProductType, "_id" | "date"> = req.body;
      const ProductUpdated: ProductType = await ProductRepository.update(_id, {
        ...newProduct,
      });

      res.status(200).json({
        message: "Product changed successfully",
        data: ProductUpdated,
      });
    } catch (error) {
      next(error); // Pasa el error al middleware
    }
  }
);

app.delete(
  "/inventory/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await ProductRepository.delete(id);
      res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error); // Pasa el error al middleware
    }
  }
);

// Middleware de manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
