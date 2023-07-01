import { Config } from './config.interface';

export default (): Config => ({
  nest: {
    port: parseInt(process.env.PORT) || 3000,
  },
  cors: {
    enabled: Boolean(process.env.CORS) || true,
  },
  security: {
    secretKey: process.env.SECRET_KEY || 'this_is_a_dummy_secret_key',
    expiresIn: process.env.TOKEN_EXPIRY_TIME || '1d',
    refreshIn: process.env.TOKEN_REFRESH_TIME || '7d',
    saltRound: parseInt(process.env.SALT_ROUND) || 10,
  },
});
