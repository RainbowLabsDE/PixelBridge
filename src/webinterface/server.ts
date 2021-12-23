import * as express from 'express';
import * as cors from 'cors';
import { config } from '../config/config';


export class WebServer {
    private app: express.Application;

    constructor() {
        this.initServer();
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

    postEditorState(req: express.Request, res: express.Response) {
        // console.log(`[Web] received editor state:`);
        // console.log(req.body);
        config.nodeEditor.editorState = req.body;
        config.save();
        res.end();
    }
}

