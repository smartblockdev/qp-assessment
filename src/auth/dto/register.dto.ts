import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/user/user.entity/user.entity';

export class RegisterDto {
  @ApiProperty({
    description: 'The username of the user.',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'strongpassword',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The role of the user.',
    example: 'user',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
