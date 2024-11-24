import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../user/user.entity/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from './roles.decorator/roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from './roles.guard/roles.guard';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: RegisterDto }) // This binds the RegisterDto schema to Swagger
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register/admin')
  @ApiOperation({ summary: 'Register a new admin user' })
  @ApiResponse({
    status: 201,
    description: 'Admin user registered successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: RegisterDto }) // This binds the RegisterDto schema to Swagger
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async registerAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.registerAdmin(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginDto }) // This binds the LoginDto schema to Swagger
  async login(@Body() loginData: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginData);
      if (!user) {
        throw new HttpException(
          { status: HttpStatus.UNAUTHORIZED, message: 'Invalid credentials' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return this.authService.login(user); // Return login response (e.g., JWT token)
    } catch (error) {
      // Catch any errors and return structured JSON response
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
