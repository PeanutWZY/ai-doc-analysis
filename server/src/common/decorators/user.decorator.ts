import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserType } from '../../user/dto/user.dto';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserType;

    // 如果指定了属性名，返回该属性（支持嵌套属性如 'username'）
    if (data) {
      const keys = data.split('.');
      return keys.reduce((obj, key) => obj?.[key], user);
    }

    return user;
  },
);

export const NotRequireAuth = () => SetMetadata('notRequireAuth', true);

export const UserTool = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const username = request.user?.username as string;

    const injectCreate = <T>(data: T): T => {
      const obj = data as any;
      if (!obj.createBy) {
        obj.createBy = username;
      }
      if (!obj.updateBy) {
        obj.updateBy = username;
      }
      return data;
    };

    const injectUpdate = <T>(data: T): T => {
      const obj = data as any;
      if (!obj.updateBy) {
        obj.updateBy = username;
      }
      return data;
    };

    return { injectCreate, injectUpdate };
  },
);

export type UserToolType = {
  injectCreate: <T>(data: T) => T;
  injectUpdate: <T>(data: T) => T;
};
