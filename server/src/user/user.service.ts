import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

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

    const { username, password } = dto;
    const updates: any = {};
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

    if (password && password !== user.password) {
      updates.password = password; // 注意：此处遵循现有系统存明文密码的模式
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
