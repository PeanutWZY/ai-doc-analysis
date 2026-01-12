import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { Api } from 'src/common/decorators/api.decorator';
import { ApiTags } from '@nestjs/swagger';
import { LoginVo, RegisterVo } from './vo/auth.vo';
import { Public } from './decorators/public.decorator';

@ApiTags('权限管理')
@Controller('auth')
// @ApiBearerAuth('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * 登录
   * @param body 登录 DTO
   * @returns 登录结果
   */
  @Public()
  @Api({
    summary: '用户登录',
    description: '使用用户名和密码进行登录',
    body: AuthLoginDto,
    type: LoginVo,
    isArray: false,
  })
  @Post('login')
  async login(@Body() body: AuthLoginDto) {
    return this.authService.login(body);
  }

  /**
   * 注册
   * @param body 注册 DTO
   * @returns 注册结果
   */
  @Public()
  @Api({
    summary: '用户注册',
    description: '使用用户名、密码和邮件进行注册',
    body: AuthRegisterDto,
    type: RegisterVo,
    isArray: false,
  })
  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }
}
