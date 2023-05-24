import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CoffeeService } from '@shared/coffee.service';
import { Message } from 'protobufjs/light';
import { BuyCoffeeMessage } from '@shared/models/buy-coffee-model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  messages: Message<BuyCoffeeMessage>[] = [];
  displayedColumns: string[] = ['name', 'price'];
  dataSource = new MatTableDataSource<Message<BuyCoffeeMessage>>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  uniqBuyer = 0;
  moneyCollected = 0;
  averageCoffeePrice = 0;


  constructor(private readonly coffeeService: CoffeeService) {
  }

  async ngOnInit() {
    const req = await this.coffeeService.getAllCoffee();
    req?.subscribe({
      next: (data) => {
        this.messages.push(data);
        this.dataSource = new MatTableDataSource<Message<BuyCoffeeMessage>>(this.messages);
        this.dataSource.paginator! = this.paginator!;
        this.uniqBuyer = _.uniq(this.messages.map(value => value.toJSON()['name'])).length;
        this.moneyCollected = this.messages.map(value => value.toJSON()['price'] as number).reduce((previousValue, currentValue) => previousValue + currentValue);
        this.averageCoffeePrice = this.moneyCollected / this.messages.length;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
