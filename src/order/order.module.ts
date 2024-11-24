import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity/order.entity';
import { Grocery } from '../grocery/grocery.entity/grocery.entity';
import { User } from '../user/user.entity/user.entity';
import { OrderItem } from './order.entity/orderItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, User, Grocery])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
