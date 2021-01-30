import { EnvConfigType } from "../interfaces/config.interface";
import dotenv from 'dotenv';

dotenv.config();

export const environment: EnvConfigType = {
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  throttle: {
    windowInMillisec: Number(process.env.WINDOW_IN_MILLISEC), // 24 hrs in milliseconds
    maximum: Number(process.env.MAXIMUM),
    message: 'Maximum number of request exceeded',
    headers: Boolean(process.env.THROTTLE_HEADERS),
  }
}