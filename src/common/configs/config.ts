import { Config } from './config.interface';

export default (): Config => {
  const email = process.env.EMAIL;

  if (!email) {
    throw new Error('Email is not present in environment variable');
  }

  const password = process.env.EMAIL_PASSWORD;

  if (!password) {
    throw new Error(
      'Password for Email is not present in environment variable.',
    );
  }

  return {
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
    mail: {
      email,
      password,
    },
  };
};
