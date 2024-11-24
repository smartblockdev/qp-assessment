import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateGroceryDto } from './create-grocery.dto';

export class UpdateGroceryDto extends PartialType(CreateGroceryDto) {
  @ApiPropertyOptional({
    description: 'Name of the grocery item',
    example: 'Apple',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Price of the grocery item',
    example: 1.99,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'Description of the grocery item',
    example: 'Fresh red apples',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Quantity of the grocery item',
    example: 100,
  })
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Quantity in stock (defaults to quantity if not set)',
    example: 100,
  })
  quantityInStock?: number;
}
