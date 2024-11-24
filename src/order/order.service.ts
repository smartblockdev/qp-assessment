import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity/order.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { Grocery } from '../grocery/grocery.entity/grocery.entity';
import { User } from '../user/user.entity/user.entity';
import { OrderItem } from './order.entity/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Grocery)
    private groceryRepository: Repository<Grocery>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Initialize total price for the order
    let totalPrice = 0;

    // Create a new order instance
    const order = this.orderRepository.create({
      user,
    });

    // Iterate over orderItems to calculate total price and prepare for saving
    const orderItems: OrderItem[] = [];
    for (const item of createOrderDto.orderItems) {
      const grocery = await this.groceryRepository.findOne({
        where: { id: item.groceryId },
      });

      if (!grocery) {
        throw new Error(`Grocery item with ID ${item.groceryId} not found`);
      }

      const itemTotalPrice = grocery.price * item.quantity;
      totalPrice += itemTotalPrice;

      // Create an OrderItem instance
      const orderItem = new OrderItem();
      orderItem.grocery = grocery;
      orderItem.quantity = item.quantity;
      orderItem.totalPrice = itemTotalPrice; // Store price for this item

      // Add OrderItem to the list
      orderItems.push(orderItem);
    }

    // Save the order with the total price and items
    order.totalPrice = totalPrice;
    order.orderItems = orderItems;

    // Save the order (this will also save the related orderItems because of cascading)
    return await this.orderRepository.save(order);
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new Error('Order not found');
    }

    const updatedOrder = Object.assign(order, updateOrderDto);
    return this.orderRepository.save(updatedOrder);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({ where: { user: { id: userId } } });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }
}
