import express from 'express';
import { AppDataSource } from './drivers/database/postgres.connect';
import { config } from './common/config';
import orderRouter from './adapters/routes/order.routes';
import { requestHttpInterceptorHandler } from './adapters/lib/request-http.interceptor';
import { errorHandler } from './adapters/lib/excepcion-manager.filter';

// configures dotenv to work in your application
const app = express();

const PORT = config.port;

async function startServer() {
  try {
    // Inicializar la base de datos
    await AppDataSource.initialize();
    console.log('📦 Database connected successfully');

    app.use(express.json());
    // Interceptor
    app.use(requestHttpInterceptorHandler);
    // Error handling
    app.use(errorHandler);

    app.use(`/${config.baseUrl}/v${config.version}/order`, orderRouter);

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
    app
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
