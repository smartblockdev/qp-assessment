import {
  Controller,
  Body,
  Get,
  Put,
  Request,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard/roles.guard';

@ApiTags('User')
@ApiBearerAuth() // This will add a Bearer token authorization header in Swagger UI
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get a user by ID
  @Get('me')
  @ApiOperation({ summary: 'Get a logged in user' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async getUserById(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  // Update user details
  @Put()
  @ApiOperation({ summary: 'Update user details' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Data to update user',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.userService.updateUser(req.user.userId, updateUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.message,
        },
        error.status,
      );
    }
  }
}
