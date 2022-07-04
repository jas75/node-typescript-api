
import express from 'express';
import helloWorld from './controllers/hello.controller';
import * as helmet from "helmet";
import rateLimit, { MemoryStore } from 'express-rate-limit'
import cors from 'cors';
import * as MySQLConnector from './utils/mysql.connector';


const app = express();
MySQLConnector.init();

const globalRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: false,
	store: new MemoryStore(),
})
app.use(helmet.expectCt({
    maxAge: 86400,
    enforce: true
}));
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use('/*', globalRateLimiter);
app.use(cors());

app.get('/', (req: express.Request, res: express.Response) => {
    const message = helloWorld();
    
    res.send({ pong: message});
});

export default app;