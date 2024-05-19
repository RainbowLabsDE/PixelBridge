import * as express from 'express';
import * as cors from 'cors';
import { config } from '../config/config';
import { NodeEngine } from './nodeEngine';
import { hostname } from 'os';


export class WebServer {
    private app: express.Application;
    nodeEngine: NodeEngine;

    constructor() {
        this.initServer();
        this.nodeEngine = new NodeEngine();
        // console.log(this.nodeEngine);
    }

    private initServer() {
        this.app = express();

        this.app.use(cors());
        this.app.use(express.json());

        this.app.use(express.static(__dirname + '/frontend/dist'));

        this.app.route('/api/modLED/modules')
            .get(this.getModLedModules);

        this.app.route('/api/modLED/size')
            .get(this.getModLedSize)
            .post(this.setModLedSize);

        this.app.route('/api/nodeEditor/editor')
            .get(this.getEditorState)
            .post(this.postEditorState)

        this.app.route('/api/nodeEditor/hostname')
            .get(this.getHostname)

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

    getEditorState(req: express.Request, res: express.Response) {
        res.json(config.nodeEditor.editorState);
    }
    
    getHostname(req: express.Request, res: express.Response) {
        res.json({hostname: hostname()});
    }

    postEditorState = (req: express.Request, res: express.Response) => {
        // console.log(`[Web] received editor state:`);
        // console.log(req.body);
        config.nodeEditor.editorState = req.body;
        config.save();
        res.end();
        this.nodeEngine.process(config.nodeEditor.editorState);
    }
}

