import { WebSocketUC } from '../../core/use_case/web-socket.uc';

const webSocket = WebSocketUC.getInstance();

webSocket.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});
