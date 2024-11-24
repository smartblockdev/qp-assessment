import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user.',
    example: 'pawan.t@cisinlabs.com',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'Pawan@123?',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
