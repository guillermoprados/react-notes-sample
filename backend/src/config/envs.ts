import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  JWT_SECRET: string;
  JWT_EXIRATION_TIME: string;
  JWT_REFRESH_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_PASSWORD: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_NAME: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXIRATION_TIME: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
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
  dbPassword: envVars.DB_PASSWORD,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbName: envVars.DB_NAME,
  dbUsername: envVars.DB_USERNAME,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpirationTime: envVars.JWT_EXIRATION_TIME,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
};
