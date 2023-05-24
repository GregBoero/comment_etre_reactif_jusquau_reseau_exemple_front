import { Message, Type } from 'protobufjs/light';

@Type.d('EmptyMessage')
export class EmptyMessage extends Message<EmptyMessage> {
  constructor() {
    super();
  }
}
