"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ICEServer {
    constructor(io) {
        this.conn_list = [];
        this.io = io;
        this.io.on('connection', (socket) => this.onConnection(socket));
        this.io.on('message', (msg) => this.onMessage(msg));
    }
    onMessage(msg) {
        console.log(msg);
    }
    onConnection(socket) {
        this.conn_list.push(socket.id);
    }
}
exports.default = ICEServer;
