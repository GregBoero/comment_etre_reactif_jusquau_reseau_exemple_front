import { Component, OnInit } from '@angular/core';
import { RsocketClientService } from '@shared/rsocket-client-service';
import { RsocketWithProtobuff } from '@shared/rsocket-with-protobuff';
import { BuyCoffeeMessage } from '@shared/models/buy-coffee-model';
import { CoffeeService } from '@shared/coffee.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  rsocket: RsocketWithProtobuff | undefined;
  isLoading = false;

  name: string = '';

  constructor(private readonly coffeeService: CoffeeService) {
  }

  async ngOnInit() {
    this.isLoading = true;
  }

  async sendCoffee() {
    const coffee = new BuyCoffeeMessage();
    coffee.name = this.name;
    coffee.price = 1.5;

    const ref = await this.coffeeService.sendCoffee(coffee);
    ref?.subscribe({
      next: () => {
        console.log('coffee Sent');
      }, error: (err) => {
        console.log('coffee error');
      }
    });
  }

  handleChange(event: Event) {
    // @ts-ignore
    this.name = event.target.value;
  }
}
