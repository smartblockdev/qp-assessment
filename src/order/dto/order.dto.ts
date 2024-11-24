import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class OrderItem {
  @ApiProperty({ description: 'ID of the grocery item' })
  @IsNumber()
  @IsNotEmpty()
  groceryId: number;

  @ApiProperty({ description: 'Quantity of the grocery item' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Array of order items', type: [OrderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  orderItems: OrderItem[];

  @ApiProperty({ description: 'total price of order', type: Number })
  @IsNumber()
  totalPrice: number;
}

export class UpdateOrderDto {
  @ApiProperty({ description: 'Status of the order', example: 'completed' })
  status: 'pending' | 'completed' | 'canceled';
}
