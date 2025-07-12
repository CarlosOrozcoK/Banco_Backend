import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Banco Backend API",
            version: "1.0.0",
            description: "API documentation for the Banco Backend",
        },
        servers: [
            {
                url: "http://localhost:3000/Backend_Banco/v1",
            },
        ],
    },
    apis: [
        "./src/**/*.routes.js",
        "./src/**/product-routes.js",
        "./src/**/service-routes.js",
        "./src/**/brand-routes.js"
    ], // Incluye todos los archivos de rutas JS
};
const swaggerDocs = swaggerJSDoc(options);

export { swaggerDocs, swaggerUi };
