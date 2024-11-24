import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GroceryService } from './grocery.service';
import { Grocery } from './grocery.entity/grocery.entity';
import { Roles } from '../auth/roles.decorator/roles.decorator';
import { RolesGuard } from '../auth/roles.guard/roles.guard';
import { UserRole } from '../user/user.entity/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';

@ApiTags('Grocery Management')
@ApiBearerAuth()
@Controller('grocery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  @Post('admin/create')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new grocery item' })
  @ApiBody({ type: CreateGroceryDto })
  @ApiResponse({
    status: 201,
    description: 'Grocery item created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() data: CreateGroceryDto): Promise<Grocery> {
    return this.groceryService.create(data);
  }

  @Get('all')
  @ApiOperation({ summary: 'Retrieve all grocery items' })
  @ApiResponse({
    status: 200,
    description: 'List of grocery items retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll(): Promise<Grocery[]> {
    return this.groceryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a grocery item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Grocery item retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Grocery item not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findOne(@Param('id') id: string): Promise<Grocery> {
    return this.groceryService.findOne(+id);
  }

  @Put('admin/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a grocery item' })
  @ApiResponse({
    status: 200,
    description: 'Grocery item updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Grocery item not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateGroceryDto,
  ): Promise<Grocery> {
    return this.groceryService.update(+id, data);
  }

  @Delete('admin/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a grocery item' })
  @ApiResponse({
    status: 204,
    description: 'Grocery item deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Grocery item not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.groceryService.remove(+id);
  }
}
