// This file contains all the configuration variables for the backend server.

export const APP_NAME = process.env.APP_NAME;

export const PRODUCTION_MODE = process.env.PRODUCTION_MODE;

export const FRONTEND_URL = (process.env.NGROK_MODE === 'true') ?
    process.env.FRONTEND_PRODUCTION_URL :
    (process.env.PRODUCTION_MODE === 'true') ?
        process.env.FRONTEND_PRODUCTION_URL :
        process.env.FRONTEND_DEVELOPMENT_URL;

export const BACKEND_URL = (process.env.PRODUCTION_MODE === 'true') ? 
    process.env.BACKEND_PRODUCTION_URL : 
    process.env.BACKEND_DEVELOPMENT_URL;

export const PORT = (process.env.PRODUCTION_MODE === 'true') ? 
    process.env.BACKEND_PORT : 
    process.env.BACKEND_PORT;

export const DATABASE_URL = (process.env.PRODUCTION_MODE === 'true') ? 
    process.env.DATABASE_PRODUCTION_URL : 
    process.env.DATABASE_DEVELOPMENT_URL;