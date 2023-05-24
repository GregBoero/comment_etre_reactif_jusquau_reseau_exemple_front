import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { RSocketConnector } from 'rsocket-core';
import { WebsocketClientTransport } from 'rsocket-websocket-client';
import { WellKnownMimeType } from 'rsocket-composite-metadata';
import MESSAGE_RSOCKET_COMPOSITE_METADATA = WellKnownMimeType.MESSAGE_RSOCKET_COMPOSITE_METADATA;
import APPLICATION_PROTOBUF = WellKnownMimeType.APPLICATION_PROTOBUF;
import { RsocketWithProtobuff } from './rsocket-with-protobuff';

@Injectable({
  providedIn: 'root'
})
export class RsocketClientService {
  client: RsocketWithProtobuff | undefined;
  intervalId?: NodeJS.Timer;


  async initClient() {
    const connector = new RSocketConnector({
      setup: {
        keepAlive: 1000000,
        lifetime: 1000000,
        // format of data
        dataMimeType: APPLICATION_PROTOBUF.toString(),
        // format of metadata
        metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.toString()
      },
      transport: new WebsocketClientTransport({
        url: `ws://localhost:8080`,
        wsCreator: (url: string) => {
          console.log('try to connect to websocket');
          const webSocket = new WebSocket(url);
          webSocket.onopen = () => {
            if (this.intervalId) {
              console.log('connect successful');
              clearInterval(this.intervalId);
              delete this.intervalId;
            }
          };
          return webSocket;
        },
        debug: true
      })
    });
    const rsocket = await connector.connect();
    rsocket.onClose((e: Error | undefined) => {
      console.error(e);
      if (
        (e?.message.includes('Incomplete RESUME handshake') || e?.message.includes('Socket closed unexpectedly')) &&
        !this.intervalId
      ) {
        this.intervalId = setInterval(() => {
          console.log('connection lost reconnecting');
          this.initClient();
        }, 500);
      }
    });
    this.client = new RsocketWithProtobuff(rsocket, 'toto');
  }

  async getRSocketClient() {
    if (!this.client) {
      await this.initClient();
    }
    return this.client;
  }
}
