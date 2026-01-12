export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'qwer123456K',
    database: process.env.POSTGRES_DB || 'ai_doc_analysis',
    ssl: process.env.POSTGRES_SSL === 'false',
    synchronize: process.env.NODE_ENV !== 'production', // 仅开发环境开启自动同步
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
