import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 修改用户信息
   * @param userId 用户ID
   * @param dto 修改信息
   */
  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { code: 3001, message: '用户不存在' };
    }

    const { username, oldPassword, newPassword } = dto;
    const updates: {
      username?: string;
      password?: string;
    } = {};
    const logs: any[] = [];

    if (username && username !== user.username) {
      // 检查用户名是否已存在
      const exists = await this.prisma.user.findUnique({ where: { username } });
      if (exists) {
        return { code: 3002, message: '用户名已存在' };
      }
      updates.username = username;
      logs.push({
        userId,
        field: 'username',
        oldValue: user.username,
        newValue: username,
      });
    }

    const passwordTouched = Boolean(oldPassword || newPassword);
    if (passwordTouched) {
      if (!oldPassword || !newPassword) {
        return { code: 3003, message: '修改密码需同时提供原密码与新密码' };
      }

      const stored = user.password;
      const isHashed =
        typeof stored === 'string' && stored.startsWith('$argon2');
      const oldValid = isHashed
        ? await argon2.verify(stored, oldPassword)
        : stored === oldPassword;
      if (!oldValid) {
        return { code: 3004, message: '原密码错误' };
      }

      const newIsSameAsOld = isHashed
        ? await argon2.verify(stored, newPassword)
        : stored === newPassword;
      if (newIsSameAsOld) {
        return { code: 3005, message: '新密码不能与旧密码相同' };
      }

      updates.password = await argon2.hash(newPassword);
      logs.push({
        userId,
        field: 'password',
        oldValue: '******',
        newValue: '******',
      });
    }

    if (Object.keys(updates).length > 0) {
      // 使用事务确保原子性
      const transactions: any[] = [
        this.prisma.user.update({
          where: { id: userId },
          data: updates,
        }),
      ];

      if (logs.length > 0) {
        transactions.push(
          this.prisma.userModificationLog.createMany({
            data: logs,
          }),
        );
      }

      await this.prisma.$transaction(transactions);
    }

    return { code: 0, message: '修改成功' };
  }

  /**
   * 获取用户修改记录
   * @param userId 用户ID
   */
  async getModificationLogs(userId: number) {
    const logs = await this.prisma.userModificationLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return { code: 0, message: 'ok', data: logs };
  }
}
