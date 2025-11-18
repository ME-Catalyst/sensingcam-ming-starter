import express, { Application } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import routes from './routes';

class App {
  public app: Application;
  public server: any;
  public io: SocketIOServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  private initializeMiddlewares() {
    // Security
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: config.corsOrigin,
        credentials: true,
      })
    );

    // Rate limiting
    this.app.use(rateLimiter);

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    const morganFormat = config.nodeEnv === 'development' ? 'dev' : 'combined';
    this.app.use(
      morgan(morganFormat, {
        stream: {
          write: (message: string) => logger.http(message.trim()),
        },
      })
    );

    logger.info('Middlewares initialized');
  }

  private initializeRoutes() {
    // API routes
    this.app.use(config.apiPrefix, routes);

    logger.info('Routes initialized');
  }

  private initializeErrorHandling() {
    // 404 handler
    this.app.use(notFoundHandler);

    // Error handler (must be last)
    this.app.use(errorHandler);

    logger.info('Error handling initialized');
  }

  private initializeSocketIO() {
    this.io.on('connection', socket => {
      logger.info(`WebSocket client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        logger.info(`WebSocket client disconnected: ${socket.id}`);
      });

      socket.on('error', error => {
        logger.error('WebSocket error:', error);
      });
    });

    logger.info('Socket.IO initialized');
  }

  public getSocketIO(): SocketIOServer {
    return this.io;
  }

  public listen() {
    this.server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      logger.info(`API endpoint: http://localhost:${config.port}${config.apiPrefix}`);
    });
  }
}

export default App;
