import { ValidationError } from "../utils/errorFactory";

// Clase de Validación
export class Validation {
  static idProduct(id: string): void {
    if (!id) throw new ValidationError("id is required");

    if (typeof id !== "string")
      throw new ValidationError("id must be a string");

  }

  static nameProduct(name: string): void {
    if (!name) throw new ValidationError("Name is required");

    if (typeof name !== "string")
      throw new ValidationError("Name must be a string");
    if (name.length < 3)
      throw new ValidationError("Name must be at least 3 characters long");
  }

  static descriptionProduct(description: string): void {
    if (!description) throw new ValidationError("Description is required");

    if (typeof description !== "string")
      throw new ValidationError("Description must be a string");
    if (description.length >= 150)
      throw new ValidationError(
        "Description should not be greater than 150 characters"
      );
  }

  static priceProduct(price: number): void {
    if (!price) throw new ValidationError("Price is required");

    if (typeof price !== "number")
      throw new ValidationError("Price must be a number");
    if (price <= 0)
      throw new ValidationError("Price must be greater than 0");
  }

  static stockProduct(stock: number): void {
    if (!stock) throw new ValidationError("Stock is required");

    if (typeof stock !== "number")
      throw new ValidationError("Stock must be a number");
    if (stock <= 0)
      throw new ValidationError("Stock must be greater than 0");
  }

  static dateProduct(date: Date): void {
    if (!date) throw new ValidationError("Date is required");

    if (!(date instanceof Date))
      throw new ValidationError("Date must be a Date");
  }
}
