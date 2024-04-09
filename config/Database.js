import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Extraer las variables de entorno
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

// Crear la conexión a la base de datos
const db = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mysql"
});

export default db;
