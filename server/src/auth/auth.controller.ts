import { Body, Controller, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';

type LoginDto = { email?: string; password?: string };
type RegisterDto = { email?: string; password?: string };

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: LoginDto) {
    const { email, password } = body ?? {};
    if (!email || !password) {
      return { code: 400, message: '缺少参数' };
    }
    const token = randomUUID();
    const user = {
      id: Math.floor(Math.random() * 99999) + 1,
      name: 'Mock User',
      email,
    };
    return { code: 0, message: 'ok', data: { token, user } };
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    const { email, password } = body ?? {};
    if (!email || !password) {
      return { code: 400, message: '缺少参数' };
    }
    const data = {
      id: Math.floor(Math.random() * 99999) + 1,
      name: 'Mock User',
      email,
      createdAt: new Date().toISOString(),
    };
    return { code: 0, message: 'ok', data };
  }
}
