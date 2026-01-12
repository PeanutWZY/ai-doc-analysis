import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Api } from '../common/decorators/api.decorator';
import { UserService } from './user.service';
import { UpdateUserDto, UserType } from './dto/user.dto';
import { UserModificationLogVo, UserProfileVo } from './vo/user.vo';
import { User } from '../common/decorators/user.decorator';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Api({
    summary: '获取当前用户信息',
    description: '通过 Token 获取当前登录用户的基本信息',
    type: UserProfileVo,
  })
  @Get('profile')
  async getProfile(@User() user) {
    return { code: 0, message: 'ok', data: user };
  }

  @Api({
    summary: '修改用户信息',
    description: '修改用户名或密码，并记录修改历史',
    body: UpdateUserDto,
  })
  @Post('update')
  async update(@Body() body: UpdateUserDto, @User() user) {
    const userId = user?.id || body.id;
    if (!userId) {
      return { code: 400, message: '无法获取用户ID' };
    }
    return this.userService.update(userId, body);
  }

  @Api({
    summary: '获取修改记录',
    description: '获取用户的修改历史记录',
    type: UserModificationLogVo,
    isArray: true,
    queries: [
      {
        name: 'userId',
        description: '用户ID',
        type: 'number',
        required: false,
      },
    ],
  })
  @Get('logs')
  async getLogs(@Query('userId') userId: number, @User() user) {
    const targetId = user?.id || userId;
    if (!targetId) {
      return { code: 400, message: '无法获取用户ID' };
    }
    return this.userService.getModificationLogs(+targetId);
  }
}
