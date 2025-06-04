'use strict';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { hash as hashPassword } from 'argon2'; 

dotenv.config();

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | Could not be connected to MongoDB');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Try connecting...');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | Connected to MongoDB');
        });
        mongoose.connection.on('open', async () => {
            console.log('MongoDB | Connected to database');
            await createDefaultAdmin(); 
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | Reconnected to MongoDB');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | Disconnected');
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });

    } catch (error) {
        console.log('Database connection failed', error);
    }
};

const createDefaultAdmin = async () => {
    try {
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        const adminExists = await usersCollection.findOne({ username: 'ADMINB' });

        if (!adminExists) {
            const hashedPassword = await hashPassword('ADMINB');

            const admin = {
                username: 'ADMINB',
                password: hashedPassword,
                role: 'ADMIN_ROLE'
            };

            await usersCollection.insertOne(admin);
            console.log('Usuario admin creado por defecto');
        } else {
            console.log('El usuario admin ya existe');
        }
    } catch (error) {
        console.error('Error al crear el usuario admin:', error);
    }
};
