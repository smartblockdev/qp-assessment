import { IsNotEmpty, IsString, IsNumber, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroceryDto {
  @ApiProperty({ description: 'Name of the grocery item', example: 'Apple' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Price of the grocery item', example: 1.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Description of the grocery item',
    example: 'Fresh red apple',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Quantity to be added', example: 10 })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Quantity in stock (defaults to 0 if not provided)',
    example: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  quantityInStock?: number;
}
