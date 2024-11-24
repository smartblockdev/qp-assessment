import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.orderItems) {
      const grocery = await this.groceryRepository.findOne({
        where: { id: item.groceryId },
      });

      if (!grocery) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Grocery item with ID ${item.groceryId} not found`,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Check stock availability
      if (grocery.quantityInStock < item.quantity) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Insufficient stock for grocery item ID ${item.groceryId}`,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const itemTotalPrice = grocery.price * item.quantity;
      totalPrice += itemTotalPrice;

      const orderItem = new OrderItem();
      orderItem.grocery = grocery;
      orderItem.quantity = item.quantity;
      orderItem.totalPrice = itemTotalPrice;

      orderItems.push(orderItem);

      grocery.quantityInStock -= item.quantity;
      await this.groceryRepository.save(grocery);
    }

    const order = this.orderRepository.create({
      user,
      totalPrice,
      orderItems,
    });

    return await this.orderRepository.save(order);
  }

  async updateOrder(
    userId: number,
    id: number,
    updateOrderDto: UpdateOrderDto,
  ) {
    // Find the order by ID, including the user relation
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.grocery'], // Include order items and groceries for stock check
    });
    console.log('🚀 ~ OrderService ~ order:', order);

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    // Check if the order belongs to the current user
    if (order.user.id !== userId) {
      throw new HttpException(
        'You can only update your own orders',
        HttpStatus.FORBIDDEN,
      );
    }

    let totalPrice = 0;

    for (const item of updateOrderDto.orderItems) {
      console.log('item:', item);

      const orderItem = order.orderItems.find(
        (oi) => oi.grocery.id === item.groceryId,
      );
      console.log('🚀 ~ OrderService ~ orderItem:', orderItem);

      if (!orderItem) {
        throw new HttpException(
          `Order item with grocery ID ${item.groceryId} not found in this order`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const grocery = orderItem.grocery;

      // Check stock availability for the updated quantity
      if (grocery.quantityInStock + orderItem.quantity < item.quantity) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Insufficient stock for grocery item ID ${item.groceryId}`,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      grocery.quantityInStock =
        grocery.quantityInStock + orderItem.quantity - item.quantity;

      await this.groceryRepository.update(
        { id: grocery.id }, // Criteria: Find by grocery ID
        { quantityInStock: grocery.quantityInStock }, // Update data: Set the new stock value
      );
      // Update the order item quantity and total price for that item
      orderItem.quantity = item.quantity;
      orderItem.totalPrice = grocery.price * item.quantity;

      totalPrice += orderItem.totalPrice;
    }

    // Update the total price of the order
    order.totalPrice = totalPrice;

    // Save the updated order
    return this.orderRepository.save(order);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({ where: { user: { id: userId } } });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }
}
