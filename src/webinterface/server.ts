import * as express from 'express';
import { config } from '../config/config';
import * as serveIndex from 'serve-index';


export class WebServer {
    private app: express.Application;

    constructor() {
        this.initServer();
    }
    
    private initServer() {
        this.app = express();

        this.app.use(express.static(__dirname + '/static'));

        this.app.listen(config.web.port, '0.0.0.0', () => {
            console.log(`[Web] Server started at http://localhost:${config.web.port}`);
        });
    }
}

