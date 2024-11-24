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
}

export class UpdateOrderDto extends CreateOrderDto {}
