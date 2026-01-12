import { ApiProperty } from '@nestjs/swagger';
// import { } from 'src/common/enum.ts';

/**
 * 登录结果
 */
export class LoginVo {
  @ApiProperty({ description: 'token' })
  token: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '邮件' })
  email: string;
}

/**
 * 注册结果
 */
export class RegisterVo {
  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '邮件' })
  email: string;
}

/**
 * 用户信息
 */
export class UserInfoVo {
  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '邮件' })
  email: string;
}

/**
 * 角色信息
 */
// export class RoleVo {
//   @ApiProperty({ description: '角色ID' })
//   roleId: number;

//   @ApiProperty({ description: '角色名称' })
//   roleName: string;

//   @ApiProperty({ description: '角色权限字符串' })
//   roleKey: string;

//   @ApiProperty({ description: '显示顺序' })
//   roleSort: number;

//   @ApiProperty({
//     description: '数据范围',
//     enum: DataScopeEnum,
//     enumName: 'DataScopeEnum',
//     enumSchema: DataScopeEnumSchema,
//   })
//   dataScope: string;

//   @ApiProperty({ description: '角色状态', enum: StatusEnum, enumName: 'StatusEnum', enumSchema: StatusEnumSchema })
//   status: string;
// }
