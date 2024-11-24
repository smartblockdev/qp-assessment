import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grocery } from './grocery.entity/grocery.entity';
import { CreateGroceryDto } from './dto/create-grocery.dto';

@Injectable()
export class GroceryService {
  constructor(
    @InjectRepository(Grocery)
    private groceryRepository: Repository<Grocery>,
  ) {}

  async create(data: CreateGroceryDto): Promise<Grocery> {
    // If quantityInStock is not set, default it to the value of quantity
    if (!data.quantityInStock && data.quantity !== undefined) {
      data.quantityInStock = data.quantity;
    }
    const newGrocery = this.groceryRepository.create(data);
    return this.groceryRepository.save(newGrocery);
  }

  findAll(): Promise<Grocery[]> {
    return this.groceryRepository.find();
  }

  findOne(id: number): Promise<Grocery> {
    return this.groceryRepository.findOneBy({ id });
  }

  async update(id: number, data: Partial<Grocery>): Promise<Grocery> {
    // Check if the grocery item exists
    const existingGrocery = await this.groceryRepository.findOneBy({ id });
    if (!existingGrocery) {
      throw new NotFoundException(`Grocery item with ID ${id} not found`);
    }

    // Update the grocery item if it exists
    await this.groceryRepository.update(id, data);

    // Return the updated grocery item
    return this.groceryRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    const existingGrocery = await this.groceryRepository.findOneBy({ id });
    if (!existingGrocery) {
      throw new NotFoundException(`Grocery item with ID ${id} not found`);
    }
    await this.groceryRepository.delete(id);
  }
}
