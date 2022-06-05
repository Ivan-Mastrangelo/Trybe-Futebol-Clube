import * as express from 'express';
import errorHandler from './middlewares/ErrorHandler';
import teamRoutes from './routes/TeamRoutes';
import loginRoutes from './routes/LoginRoutes';
import getAllMatches from './routes/MatchesRoutes';

class App {
  public app: express.Express;
  public login = loginRoutes;
  public teams = teamRoutes;
  public matches = getAllMatches;
  // public midError = errorHandler;
  constructor() {
    this.app = express();
    this.config();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };
    this.app.use(express.json());
    this.app.use(accessControl);
    this.app.use('/login', loginRoutes);
    this.app.use('/teams', teamRoutes);
    this.app.use('/matches', getAllMatches);
    this.app.use(errorHandler);
  }

  // ...
  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`listening on ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
