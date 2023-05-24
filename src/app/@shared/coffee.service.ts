import { Injectable } from '@angular/core';
import { RsocketClientService } from '@shared/rsocket-client-service';
import { BuyCoffeeMessage } from '@shared/models/buy-coffee-model';
import { EmptyMessage } from '@shared/models/empty-message';


const route = {
  sendCoffee: () => 'coffee.send',
  getAllCoffee: () => 'coffee.get-all'
};

@Injectable({
  providedIn: 'root'
})
export class CoffeeService {

  constructor(private service: RsocketClientService) {
  }

  async sendCoffee(coffee: BuyCoffeeMessage) {
    const socket = await this.service.getRSocketClient();
    return socket?.fireAndForget<BuyCoffeeMessage>(route.sendCoffee(), coffee, BuyCoffeeMessage);
  }

  async getAllCoffee() {
    const socket = await this.service.getRSocketClient();
    return socket?.requestStream<EmptyMessage, BuyCoffeeMessage>(route.getAllCoffee(), BuyCoffeeMessage);
  }


}
