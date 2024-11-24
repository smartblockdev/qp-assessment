// src/orders/order-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Grocery } from 'src/grocery/grocery.entity/grocery.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // Each OrderItem is associated with one Order
  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @OneToOne(() => Grocery, (grocery) => grocery.id)
  @JoinColumn({ name: 'grocery_id' })
  grocery: Grocery;

  // Quantity of this item in the order
  @Column('int')
  quantity: number;

  // Total price for this particular item (price * quantity)
  @Column('decimal')
  totalPrice: number;
}
