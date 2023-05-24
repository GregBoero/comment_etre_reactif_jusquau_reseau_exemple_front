import { RSocket } from 'rsocket-core';
import { encodeBearerAuthMetadata, encodeRoute, WellKnownMimeType } from 'rsocket-composite-metadata';
import { Codec, RSocketRequester } from 'rsocket-messaging';
import { RxRequestersFactory } from 'rsocket-adapter-rxjs';
import { Message } from 'protobufjs/light';
import { Observable } from 'rxjs';
import MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;
import APPLICATION_PROTOBUF = WellKnownMimeType.APPLICATION_PROTOBUF;
import MESSAGE_RSOCKET_AUTHENTICATION = WellKnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION;
import { EmptyMessage } from '@shared/models/empty-message';

class ProtoBufCodec<T extends Message> implements Codec<T> {
  mimeType = APPLICATION_PROTOBUF.toString();

  private readonly $type;

  constructor(private readonly type: new () => T) {
    this.$type = new type();
  }

  decode(buffer: Buffer): T {
    return this.$type.$type.decode(buffer) as T;
  }

  encode(entity: T): Buffer {
    return Buffer.from(entity.$type.encode(entity).finish());
  }
}

export class RsocketWithProtobuff {
  requester: RSocketRequester;

  constructor(private rsocket: RSocket, private token: string) {
    this.requester = RSocketRequester.wrap(rsocket);
  }

  fireAndForget<T extends Message>(route: string, data: T, dataType: new () => T): Observable<void> {
    const codec = new ProtoBufCodec<T>(dataType);
    return this.requester
      .route(route)
      .metadata(MESSAGE_RSOCKET_ROUTING, encodeRoute(route))
      .metadata(MESSAGE_RSOCKET_AUTHENTICATION, encodeBearerAuthMetadata(this.token))
      .request(RxRequestersFactory.fireAndForget(data, codec));
  }

  requestResponse<T extends Message, D extends Message>(
    route: string,
    returnType: new () => D,
    data?: T,
    dataType?: new () => T
  ): Observable<Message<D>> {
    const candidateData = data === undefined ? new EmptyMessage() : data;
    const candidateDataType = dataType === undefined ? EmptyMessage : dataType;

    // @ts-ignore
    return this.requester
      .route(route)
      .metadata(MESSAGE_RSOCKET_ROUTING, encodeRoute(route))
      .metadata(MESSAGE_RSOCKET_AUTHENTICATION, encodeBearerAuthMetadata(this.token))
      .request(
        RxRequestersFactory.requestResponse(
          candidateData,
          // @ts-ignore
          new ProtoBufCodec<T>(candidateDataType),
          new ProtoBufCodec<D>(returnType)
        )
      );
  }

  requestStream<T extends Message, D extends Message>(
    route: string,
    returnType: new () => D,
    data?: T,
    dataType?: new () => T
  ): Observable<Message<D>> {
    const candidateData = data === undefined ? new EmptyMessage() : data;
    const candidateDataType = dataType === undefined ? EmptyMessage : dataType;
    return (
      this.requester
        .route(route)
        .metadata(MESSAGE_RSOCKET_ROUTING, encodeRoute(route))
        .metadata(MESSAGE_RSOCKET_AUTHENTICATION, encodeBearerAuthMetadata(this.token))
        // @ts-ignore
        .request(
          RxRequestersFactory.requestStream(
            candidateData,
            // @ts-ignore
            new ProtoBufCodec<T>(candidateDataType),
            new ProtoBufCodec<D>(returnType)
          )
        )
    );
  }

  requestChannel<T extends Message, D extends Message>(
    route: string,
    returnType: new () => D,
    data: Observable<T>,
    dataType: new () => T
  ): Observable<Message<D>> {
    return (
      this.requester
        .route(route)
        .metadata(MESSAGE_RSOCKET_ROUTING, encodeRoute(route))
        .metadata(MESSAGE_RSOCKET_AUTHENTICATION, encodeBearerAuthMetadata(this.token))
        // @ts-ignore
        .request(
          // @ts-ignore
          RxRequestersFactory.requestChannel(data, new ProtoBufCodec<T>(returnType), new ProtoBufCodec<D>(dataType))
        )
    );
  }
}
