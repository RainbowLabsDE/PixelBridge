import * as express from 'express';
import * as cors from 'cors';
import * as WebSocket from 'ws';
import * as http from 'http';
import { config } from '../config/config';
import { NodeEngine } from './nodeEngine';
import { hostname } from 'os';

export class WebServer {
    private app: express.Application;
    private server: http.Server;
    private wss: WebSocket.Server;
    nodeEngine: NodeEngine;

    constructor() {
        this.initServer();
        this.initWebSocketServer();
        this.nodeEngine = new NodeEngine(this);
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
    }

    private getModLedSize(req: express.Request, res: express.Response) {
        res.json(config.modLED.size);
    }

    private setModLedSize(req: express.Request, res: express.Response) {
        console.log(req);
    }

    private getModLedModules(req: express.Request, res: express.Response) {
        res.json(config.modLED.modules);
    }

    private getEditorState(req: express.Request, res: express.Response) {
        res.json(config.nodeEditor.editorState);
    }

    private getHostname(req: express.Request, res: express.Response) {
        res.json({ hostname: hostname() });
    }

    private postEditorState = (req: express.Request, res: express.Response) => {
        // console.log(`[Web] received editor state:`);
        // console.log(req.body);
        config.nodeEditor.editorState = req.body;
        config.save();
        res.end();
        this.nodeEngine.process(config.nodeEditor.editorState);
    }

    private initWebSocketServer() {
        this.server = http.createServer(this.app);

        // Create a WebSocket server and attach it to the HTTP server
        this.wss = new WebSocket.Server({ noServer: true /*server: this.server*/ });

        // WebSocket connection event handler
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('[Web] WebSocket client connected.');

            // WebSocket message event handler
            ws.on('message', (message: string) => {
                console.log('[Web] Received message:', message);

                // Handle incoming messages here
            });

            // WebSocket close event handler
            ws.on('close', () => {
                console.log('[Web] WebSocket client disconnected.');
            });

        });

        this.server.on('upgrade', async (req, socket, head) => {
            try {
                this.wss.handleUpgrade(req, socket, head, (ws) => {
                    // Do something before firing the connected event

                    this.wss.emit('connection', ws, req)
                })
            } catch (err) {
                // Socket uprade failed
                // Close socket and clean
                console.log('[Web] Socket upgrade failed', err)
                socket.destroy()
            }
        })

        
        this.server.listen(config.web.port, '0.0.0.0', () => {
            console.log(`[Web] Server started at http://localhost:${config.web.port}`);
        });
    }

    public async sendWSMessage(message: string) {
        // TODO: actually async
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

