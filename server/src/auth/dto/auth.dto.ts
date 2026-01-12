import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 登录 DTO
 */
export class AuthLoginDto {
  @ApiProperty({ required: true, description: '用户名或邮箱' })
  @IsString()
  name: string;

  @ApiProperty({ required: true, description: '密码' })
  @IsString()
  password: string;
}

/**
 * 注册 DTO
 */
export class AuthRegisterDto {
  @ApiProperty({ required: true, description: '用户名' })
  @IsString()
  username: string;

  @ApiProperty({ required: true, description: '邮箱' })
  @IsString()
  email: string;

  @ApiProperty({ required: true, description: '密码' })
  @IsString()
  password: string;
}

/**
 * 批量选择用户授权角色 DTO
 */
export class AuthUserSelectAllDto {
  @ApiProperty({ required: true, description: '角色ID' })
  @IsNumber()
  roleId: number;

  @ApiProperty({ required: true, description: '用户ID列表' })
  @IsString()
  userIds: string;
}
