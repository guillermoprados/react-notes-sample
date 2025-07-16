import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  POSTGRES_PASSWORD: string;
  POSTGRES_HOST: string;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  JWT_SECRET: string;
  JWT_EXIRATION_TIME: string;
  JWT_REFRESH_SECRET: string;
  CORS_ORIGIN: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    POSTGRES_HOST: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    POSTGRES_USER: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXIRATION_TIME: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    CORS_ORIGIN: joi.string().default('http://localhost:5173'),
  })
  .unknown(true);

const validationResult = envsSchema.validate(process.env);
const error = validationResult.error;
const value = validationResult.value as EnvVars;

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const env = {
  port: envVars.PORT,
  dbPassword: envVars.POSTGRES_PASSWORD,
  dbHost: envVars.POSTGRES_HOST,
  dbPort: 5432,
  dbName: envVars.POSTGRES_DB,
  dbUsername: envVars.POSTGRES_USER,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpirationTime: envVars.JWT_EXIRATION_TIME,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  corsOrigin: envVars.CORS_ORIGIN,
};
