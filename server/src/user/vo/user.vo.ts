import { ApiProperty } from '@nestjs/swagger';

export class UserProfileVo {
  @ApiProperty({ description: '用户ID' })
  id: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}

export class UserModificationLogVo {
  @ApiProperty({ description: '记录ID' })
  id: number;

  @ApiProperty({ description: '修改字段' })
  field: string;

  @ApiProperty({ description: '修改前的值' })
  oldValue: string | null;

  @ApiProperty({ description: '修改后的值' })
  newValue: string | null;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
