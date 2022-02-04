import SerialPort = require("serialport");
import { Frame } from "../common/frame.interface";
import { BaseSink } from "./BaseSink";



export class SerialSink extends BaseSink {
    port: SerialPort;
    currentlyTransmitting: boolean = false;

    // width & height not actually needed
    constructor(width: number, height: number, protected portName: string, protected baudrate: number) {
        super(width, height);
        setTimeout(() => this.initConnection(), 200); // try to circumvent race condition of port not closing fast enough on baudrate change
    }

    initConnection() {
        this.port = new SerialPort(this.portName, { baudRate: this.baudrate }, (error) => {
            process.stdout.write(`[Serial] Sink inizializing for port '${this.portName}'... `);
            if (error) {
                console.log(`failed! (${error})`);
            }
            else {
                console.log("success!");
            }
        });
        this.port.on('error', (data) => {
            console.log('[Serial] Unhandled error!', data);
        });

    }

    close() {
        if (this.port?.isOpen) {
            this.port.close((error) => {
                console.log(`[Serial] Sink closing for port '${this.portName}' ${error ? error : ''}`);
            });
        }
    }

    async sendFrame(frame: Frame): Promise<void> {
        if (this.port?.isOpen) {
            if (this.currentlyTransmitting) {
                console.log(`[Serial] Warning! Dropping frame. Previous write still in progress. Reduce framerate or increase baudrate.`);
                return;
            }

            this.currentlyTransmitting = true;

            this.port.write(frame.buffer, (err, bytesWritten) => {
                this.currentlyTransmitting = false;
                if (err) {
                    console.log(`[Serial] Unhandled error during write:`, err);
                }
            });

        }

    }
}