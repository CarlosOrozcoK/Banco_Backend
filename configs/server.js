'use strict';

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit'; 
import { dbConnection } from './mongo.js';
import authRoutes from '../src/auth/auth.routes.js';
import productRoutes from '../src/product/product-routes.js'
import serviceRoutes from '../src/servicio/service-routes.js'
import brandRoutes from '../src/Brand/brand-routes.js'
import transactionRoutes from "../src/transactions/transactions.routes.js"
import accounts from "../src/account/account.routes.js"
import creditRoutes from "../src/credit/credit.routes.js"
import { swaggerDocs, swaggerUi } from './swagger.js';
import userRoutes from '../src/users/user.routes.js';

dotenv.config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({origin: "https://banco-frontend.vercel.app"}));
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter); 
}

const routes = (app) => {
    app.use("/Backend_Banco/v1/auth", authRoutes);
    app.use("/Backend_Banco/v1/product", productRoutes);
    app.use("/Backend_Banco/v1/service", serviceRoutes);
    app.use("/Backend_Banco/v1/brand", brandRoutes);
    app.use("/Backend_Banco/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use("/Backend_Banco/v1/transaction", transactionRoutes)
    app.use("/Backend_Banco/v1/accounts", accounts)
    app.use("/Backend_Banco/v1/user", userRoutes);
    app.use("/Backend_Banco/v1/credit", creditRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Succesful connecting to database!')
    } catch (error) {
        console.log('Error connecting to database!');
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}!`);
    } catch (err) {
        console.log(`Server init failed: ${err}!`);
    }
}
