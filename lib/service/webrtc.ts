import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
class ICEServer {
  private io
  conn_list: string[] = []
  constructor(io: Server) {
    this.io = io

    this.io.on(
      'connection',
      (
        socket: Socket<
          DefaultEventsMap,
          DefaultEventsMap,
          DefaultEventsMap,
          any
        >
      ) => this.onConnection(socket)
    )

    this.io.on('message', (msg: any) => this.onMessage(msg))
  }

  onMessage(this: ICEServer, msg: any) {
    console.log(msg)
  }

  onConnection(
    this: ICEServer,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {
    this.conn_list.push(socket.id)
  }
}

export default ICEServer
