import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { initTransactionDto } from './order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  initTransactionDto(@Body() body: initTransactionDto) {
    return this.ordersService.initTransaction(body);
  }
}
