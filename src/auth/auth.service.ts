import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../user/user.entity/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(loginData: LoginDto): Promise<User | null> {
    const user = await this.userService.findByUsername(loginData.username);
    if (user && (await bcrypt.compare(loginData.password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = this.userService.createUser({
      username: registerDto.username,
      password: hashedPassword,
      role: UserRole.USER,
    });
    return newUser;
  }

  async registerAdmin(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = this.userService.createUser({
      username: registerDto.username,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    return newUser;
  }
}
