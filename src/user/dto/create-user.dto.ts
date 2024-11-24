import { IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.entity/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'strongpassword',
  })
  @MinLength(6)
  password: string; // In practice, make sure to hash passwords before storing them

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole, // Reference the enum to ensure correct enum values are shown in Swagger
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
