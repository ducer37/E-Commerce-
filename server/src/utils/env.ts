import "dotenv/config";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is missing`);
  }
  return value;
};

export const env = {
  PORT: getEnv("PORT", "3000"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),
  SMTP_HOST: getEnv("SMTP_HOST", "smtp.gmail.com"),
  SMTP_PORT: getEnv("SMTP_PORT", "587"),
  SMTP_SECURE: getEnv("SMTP_SECURE", "false"),
  SMTP_USER: getEnv("SMTP_USER"),
  SMTP_PASS: getEnv("SMTP_PASS"),
  FROM_EMAIL: getEnv("FROM_EMAIL"),
};
