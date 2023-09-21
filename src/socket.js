import { io } from 'socket.io-client';
import { API_URL } from './constants/constants';


const URL = process.env.NODE_ENV === 'production' ? undefined : API_URL;

export const socket = io(URL);