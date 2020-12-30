import * as express from 'express';
import { config } from '../config/config';


export class WebServer {
    private app: express.Application;

    constructor() {
        this.initServer();
    }
    
    private initServer() {
        this.app = express();

        this.app.use(express.static(__dirname + '/static'));

        this.app.route('/api/modLED/modules')
            .get(this.getModLedModules);

        this.app.route('/api/modLED/size')
            .get(this.getModLedSize)
            .post(this.setModLedSize);

        this.app.listen(config.web.port, '0.0.0.0', () => {
            console.log(`[Web] Server started at http://localhost:${config.web.port}`);
        });
    }

    getModLedSize(req: express.Request, res: express.Response) {
        res.json(config.modLED.size);
    }

    setModLedSize(req: express.Request, res: express.Response) {
        console.log(req);
    }

    getModLedModules(req: express.Request, res: express.Response) {
        res.json(config.modLED.modules);
    }
}

