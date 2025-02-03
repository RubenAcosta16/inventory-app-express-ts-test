// import { Low } from "lowdb";
// import { JSONFile } from "lowdb/node";
import crypto from "node:crypto";

import { Validation } from "./validations";
import { ProductType } from "../utils/types";
import { ProductError,NotFoundError } from "../utils/errorFactory";

// Configuración de Lowdb
// const adapter = new JSONFile<{ inventory: ProductType[] }>("../db/db.json");
// const db = new Low(adapter, { inventory: [] });

// Inicializar la base de datos
async function initDB() {
  // await db.read();
  // db.data ||= { inventory: [] };
  // await db.write();
}

let products: ProductType[] = [
  {
    _id: "1",
    name: "some name",
    description: "some description",
    price: 10,
    stock: 10,
    date: new Date(),
  },
  {
    _id: "2",
    name: "Cube",
    description: "some description",
    price: 10,
    stock: 10,
    date: new Date(),
  },
];

// Nombre
// descripción
// nivel de prioridad

// Clase UserRepository
export class ProductRepository {
  static async getOne(_id: string): Promise<ProductType> {
    await initDB(); // Asegurarse de que la DB esté inicializada

    Validation.idProduct(_id);

    const productFound = products.find((product) => product._id === _id);
    if (!productFound) throw new NotFoundError("Product not found");

    return productFound;
  }

  static async getAll(): Promise<ProductType[]> {
    await initDB(); // Asegurarse de que la DB esté inicializada
    return products;
  }

  static async create({
    name,
    description,
    price,
    stock,
  }: Omit<ProductType, "_id" | "date">): Promise<{ _id: string }> {
    await initDB(); // Asegurarse de que la DB esté inicializada

    Validation.nameProduct(name);
    Validation.descriptionProduct(description);
    Validation.priceProduct(price);
    Validation.stockProduct(stock);

    const id = crypto.randomUUID();

    const existingProduct = products.find((product) => product.name === name);
    if (existingProduct) throw new ProductError("Product already exists");

    products.push({
      _id: id,
      name,
      description,
      price,
      stock,
      date: new Date(),
    });
    // await db.write(); // Guardar cambios en la base de datos

    return { _id: id };
  }

  static async update(
    _id: string,
    { description, name, price, stock }: Omit<ProductType, "date" | "_id">
  ): Promise<ProductType> {
    await initDB(); // Asegurarse de que la DB esté inicializada

    Validation.idProduct(_id);
    Validation.nameProduct(name);
    Validation.descriptionProduct(description);
    Validation.priceProduct(price);
    Validation.stockProduct(stock);

    // si el producto no cambia, no se actualiza

    const productIndex = products.findIndex((product) => product._id === _id);
    if (productIndex === -1) throw new NotFoundError("Product not found");

    products[productIndex] = {
      _id,
      name,
      description,
      price,
      stock,
      date: new Date(),
    };

    // await db.write(); // Guardar cambios en la base de datos

    return { description, name, price, stock, _id, date: new Date() };
  }

  static async delete(_id: string): Promise<void> {
    await initDB(); // Asegurarse de que la DB esté inicializada

    Validation.idProduct(_id);

    const productIndex = products.findIndex((product) => product._id === _id);
    if (productIndex === -1) throw new ProductError("Product not found");

    products.splice(productIndex, 1);
    // await db.write(); // Guardar cambios en la base de
  }
}
