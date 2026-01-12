import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';

type DbUser = {
  id: number;
  email: string;
  username: string | null;
  password: string;
  createdAt: Date;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 登录
   * @param body 登录 DTO
   * @returns 登录结果
   */
  async login(body: AuthLoginDto) {
    const { name, password } = body ?? {};
    if (!name || !password) {
      return { code: 400, message: '缺少参数' };
    }
    const found = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: name }, { email: name }],
      },
    });
    if (!found || found.password !== password) {
      return { code: 401, message: '账号或密码错误' };
    }

    const payload = { username: found.username, sub: found.id };
    const token = this.jwtService.sign(payload);

    const user: { id: number; username: string; email: string } = {
      id: found.id,
      username: found.username ? found.username : 'User',
      email: found.email,
    };
    return { code: 0, message: 'ok', data: { token, user } };
  }

  /**
   * 注册
   * @param body 注册 DTO
   * @returns 注册结果
   */
  async register(body: AuthRegisterDto) {
    const { username, email, password } = body ?? {};
    if (!username || !email || !password) {
      return { code: 400, message: '缺少参数' };
    }
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) {
      return { code: 409, message: '邮箱已存在' };
    }
    const existsUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existsUsername) {
      return { code: 409, message: '用户名已存在' };
    }
    const created = (await this.prisma.user.create({
      data: { email, password, username },
    })) as DbUser;
    const data: {
      id: number;
      username: string | null;
      email: string;
      createdAt: string;
    } = {
      id: created.id,
      username: created.username,
      email: created.email,
      createdAt: created.createdAt.toISOString(),
    };
    return { code: 0, message: 'ok', data };
  }
}
