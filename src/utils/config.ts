import dotenv from 'dotenv';

// Carga las variables de entorno
dotenv.config();


export const { PORT=3000 } = process.env;
