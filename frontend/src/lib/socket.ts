import { io } from 'socket.io-client';
export const kitchenSocket = io('http://54.165.122.199:3001');
export const warehouseSocket = io('http://54.165.122.199:3002');
