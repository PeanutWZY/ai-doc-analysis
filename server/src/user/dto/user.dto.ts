import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export type UserType = {
  id: number;
  username: string;
  email: string | null;
};

export class UpdateUserDto {
  @ApiProperty({ description: '用户ID', required: false })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  username?: string;

  @ApiProperty({ description: '原密码', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  oldPassword?: string;

  @ApiProperty({ description: '新密码', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  newPassword?: string;
}
