import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grocery } from './grocery.entity/grocery.entity';
import { GroceryService } from './grocery.service';
import { GroceryController } from './grocery.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Grocery])],
  providers: [GroceryService],
  controllers: [GroceryController],
})
export class GroceryModule {}
