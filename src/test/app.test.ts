import request from "supertest";
import app from "../index";
import { ProductType } from "../utils/types";

// describe("GET /api", () => {
//   it("responds with 200 code", async () => {
//     const response = await request(app).get("/api");
//     expect(response.status).toBe(200);
//   });

//   it("responds with json with an array", async () => {
//     const response = await request(app).get("/api");
//     expect(response.body).toEqual({ data: "¡Hola, TypeScript con Express!" });

//     // expect(response.body).toBeInstanceOf(Object);

//     // // Verifica que 'data' sea un array
//     // expect(response.body.data).toBeInstanceOf(Array);

//     // // Verifica que el array no esté vacío
//     // expect(response.body.data.length).toBeGreaterThan(0);

//     // response.body.data.forEach((task: any) => {
//     //   expect(typeof task.id).toBe('number');
//     //   expect(typeof task.name).toBe('string');
//     //   expect(typeof task.description).toBe('string');
//     // });
//   });
// });

describe("Get /inventory", () => {
  it("should respond with some products", async () => {
    const response = await request(app).get("/inventory");

    // Verifica que el código de estado sea 200
    expect(response.status).toBe(200);

    // Verifica que la respuesta tenga un objeto 'data' definido
    expect(response.body.data).toBeDefined();

    // Verifica que 'data' sea un array
    expect(Array.isArray(response.body.data)).toBe(true);

    // Si deseas verificar que el array tenga elementos
    expect(response.body.data.length).toBeGreaterThan(0);

    // Verifica que el primer elemento tenga un ID definido (opcional)
    if (response.body.data.length > 0) {
      expect(response.body.data[0]._id).toBeDefined();
    }
  });
});

describe("Get /inventory one", () => {
  it("should respond with the product having ID '2'", async () => {
    const response = await request(app).get("/inventory/2");

    // Verifica que el código de estado sea 200
    expect(response.status).toBe(200);

    // Verifica que la respuesta tenga un objeto definido
    expect(response.body).toBeDefined();

    // Verifica que el objeto tenga el ID correcto
    expect(response.body.data._id).toBe("2");

    // Verifica que el nombre del producto sea "Cube"
    expect(response.body.data.name).toBe("Cube");

    // Verifica que la descripción sea correcta
    expect(response.body.data.description).toBe("some description");

    // Verifica que el precio sea 10
    expect(response.body.data.price).toBe(10);

    // Verifica que el stock sea 10
    expect(response.body.data.stock).toBe(10);

    // Verifica que la fecha sea una instancia de Date
    // expect(response.body.data.date).toBeInstanceOf(Date);
  });
});

describe("POST /inventory", () => {
  it("should respond with an ID and verify the product creation", async () => {
    const newProduct: Omit<ProductType, "_id" | "date"> = {
      name: "gtfds",
      description: "some description",
      price: 10,
      stock: 10,
    };

    const response = await request(app).post("/inventory").send(newProduct);

    // Verifica que el código de estado sea 200
    expect(response.status).toBe(200);

    // Verifica que la respuesta tenga un ID definido
    expect(response.body.data).toBeDefined();

    // Ahora verifica que el producto realmente se creó
    const productId = response.body.data; // ID del nuevo producto
    const getResponse = await request(app).get(`/inventory/${productId}`);

    // Verifica que el código de estado sea 200
    expect(getResponse.status).toBe(200);

    // Verifica que la respuesta tenga el objeto del producto
    expect(getResponse.body.data).toBeDefined();

    // Verifica que los detalles del producto sean correctos
    expect(getResponse.body.data.name).toBe(newProduct.name);
    expect(getResponse.body.data.description).toBe(newProduct.description);
    expect(getResponse.body.data.price).toBe(newProduct.price);
    expect(getResponse.body.data.stock).toBe(newProduct.stock);
  });
});


describe("Update /inventory/:id", () => {
  it("should respond with an ID and verify the product update", async () => {
    const newProduct: Omit<ProductType, "_id" | "date"> = {
      name: "gtfds",
      description: "some description",
      price: 10,
      stock: 10,
    };

    // Primero, actualizamos el producto
    const response = await request(app).put("/inventory/2").send(newProduct);

    // Verifica que el código de estado sea 200
    expect(response.status).toBe(200);

    // Verifica que la respuesta tenga un ID definido
    expect(response.body.data).toBeDefined();

    // Ahora verificamos que el producto realmente se actualizó
    const productId = response.body.data._id; // ID del producto actualizado
    const getResponse = await request(app).get(`/inventory/${productId}`);

    // Verifica que el código de estado sea 200
    expect(getResponse.status).toBe(200);

    // Verifica que la respuesta tenga el objeto del producto actualizado
    expect(getResponse.body.data).toBeDefined();

    // Verifica que los detalles del producto sean los correctos
    expect(getResponse.body.data.name).toBe(newProduct.name);
    expect(getResponse.body.data.description).toBe(newProduct.description);
    expect(getResponse.body.data.price).toBe(newProduct.price);
    expect(getResponse.body.data.stock).toBe(newProduct.stock);
  });
});


describe("Delete /inventory/:id", () => {
  it("should respond with a message and confirm deletion", async () => {
    const deleteResponse = await request(app).delete("/inventory/2");

    // Verifica que el código de estado sea 200
    expect(deleteResponse.status).toBe(200);

    // Verifica que la respuesta tenga el mensaje esperado
    expect(deleteResponse.body).toEqual({
      message: "Product deleted successfully",
    });

    // Ahora verificamos que el producto ya no existe
    const getResponse = await request(app).get("/inventory/2");

    // Verifica que el código de estado sea 404 (no encontrado)
    expect(getResponse.status).toBe(404);

    // Verifica que la respuesta tenga un mensaje de error apropiado
    expect(getResponse.body).toEqual({
      message: "Product not found",
    });
  });
});

