import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno
const requiredEnvVars = [
  'PORT',
  'BASE_URL',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'REDIS_HOST',
  'REDIS_PORT',
];

export function validateEnvVars() {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1); // Detener la ejecución si faltan variables
  }
}
