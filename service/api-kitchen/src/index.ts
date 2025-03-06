import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { AppDataSource } from './drivers/database/postgres.connect';
import { config } from './common/config';
import { requestHttpInterceptorHandler } from './adapters/lib/request-http.interceptor';
import { errorHandler } from './adapters/lib/excepcion-manager.filter';
import orderRouter from './adapters/routes/order.routes';
import recipesRouter from './adapters/routes/recipes.routes';
import './adapters/event/task-queue.subscriber';

// configures dotenv to work in your application
const app = express();
const server = http.createServer(app); // Crear servidor HTTP para WebSockets
export const webSocket = new Server(server, {
  cors: { origin: '*' },
});
import './adapters/event/web-socket.subcriber';

const PORT = config.port;

async function startServer() {
  try {
    // Inicializar la base de datos
    await AppDataSource.initialize();
    console.log('📦 Database connected successfully');

    app.use(express.json());
    // Interceptor
    app.use(requestHttpInterceptorHandler);

    app.use(cors());

    app.use(`/${config.baseUrl}/v${config.version}/order`, orderRouter);
    app.use(`/${config.baseUrl}/v${config.version}/recipes`, recipesRouter);

    // Error handling
    app.use(errorHandler);
    // Middleware para manejar rutas no encontradas (404)
    app.use((req, res, next) => {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'La ruta solicitada no existe',
        status: 404,
        data: null,
      });
    });
    // Función para obtener las rutas registradas
    const getRoutes = () => {
      const routes: { method: string; path: any }[] = [];
      app._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
          // Rutas definidas directamente en app
          routes.push({ method: Object.keys(middleware.route.methods)[0].toUpperCase(), path: middleware.route.path });
        } else if (middleware.name === 'router') {
          // Rutas en Routers
          middleware.handle.stack.forEach((route: any) => {
            if (route.route) {
              routes.push({ method: Object.keys(route.route.methods)[0].toUpperCase(), path: route.route.path });
            }
          });
        }
      });
      return routes;
    };

    // Iniciar el servidor HTTP
    server
      .listen(PORT, () => {
        console.table(getRoutes()); // Imprime las rutas en formato tabla
        console.log(`🚀 Server running at http://localhost:${PORT}/${config.baseUrl}/v${config.version}`);
      })
      .on('error', (error) => {
        // gracefully handle error
        throw new Error(error.message);
      });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

startServer();
