import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  initMayor: process.env.INIT_MAYOR,
  address: process.env.ADDRESS,
  TESTNET: !!process.env.TESTNET,
} as const;
