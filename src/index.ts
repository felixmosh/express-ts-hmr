import chalk from 'chalk';
import express from "express";
import { getRoutes } from './router';


let router = getRoutes();

let routerWithHMR: any = router;

if (module.hot) {
  routerWithHMR = (req: Request, res: Response) => (router as any).handle(req, res);

  module.hot.accept('./router', () => {
    // eslint-disable-next-line no-console
    console.log(`[ ${chalk.magentaBright.bold(`Server-side HMR`)} ] Reloading server...`);
    try {
      const { getRoutes } = require('./router');
      router = getRoutes();
    } catch (error) {
      console.error(error);
    }
  });
  // eslint-disable-next-line no-console
  console.info(`[ ${chalk.magentaBright.bold(`Server-side HMR`)} ] Enabled!`);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(routerWithHMR).listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
