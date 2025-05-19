import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  initMayor: process.env.INIT_MAYOR,
  address: process.env.ADDRESS,
  TESTNET: !!process.env.TESTNET,
  DISCORD_ATTESTOR: process.env.DISCORD_ATTESTOR,
  TELEGRAM_ATTESTOR: process.env.TELEGRAM_ATTESTOR,
  FRONT_END_URL: process.env.FRONT_END_URL,
} as const;
