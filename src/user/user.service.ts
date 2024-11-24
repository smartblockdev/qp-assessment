import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;

    const user = this.userRepository.create({
      username,
      password, // Ensure to hash the password before saving it
      role,
    });

    return await this.userRepository.save(user);
  }

  // Find user by ID
  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Find user by username
  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  // Update user details
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the username is already taken by another user
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username is already taken');
      }
    }

    // Merge the updated data with the existing user data
    const updatedUser = Object.assign(user, updateUserDto);

    return await this.userRepository.save(updatedUser);
  }
}
