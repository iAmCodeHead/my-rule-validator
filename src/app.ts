import Express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import { errorHandler } from "../middlewares/error.handler";


import rateLimit from 'express-rate-limit';
import { environment } from '../config';
import { UserController } from '../controllers/users/users.controller';

const rateLimiter = rateLimit(environment.throttle);

class App {
    app: Express.Application;

    constructor() {
        this.app = Express();
        this.middlewares();
    }

    private middlewares = () => {
        this.app.use(helmet());
        this.app.use(Express.json());
        this.app.use(Express.urlencoded({ extended: true }));
        this.app.use(rateLimiter)
        this.app.use(cors());
        this.app.use(errorHandler)
        this.router()
    }


  private router() {
    this.app.get('/', UserController.devInfo);
    this.app.post('/validate-rule', UserController.validateRule);
    this.app.all('*', UserController.invalidRoute);
  }

  public start = async () => {
    console.log('Starting Server...');
    http.createServer(this.app).listen(environment.server.port, () => {
      console.log(`Server listening on port ${environment.server.port}! `);
    });
  }
}

const app = new App;

app.start();