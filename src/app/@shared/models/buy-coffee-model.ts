import { Field, Message, Type } from 'protobufjs/light';

@Type.d('BuyCoffeeMessage')
export class BuyCoffeeMessage extends Message<BuyCoffeeMessage> {

  @Field.d(1, 'string')
  public name: string | undefined;

  @Field.d(2, 'double')
  public price: number | undefined;

  constructor() {
    super();
  }
}
