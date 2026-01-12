"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { login, logout } from "@/store/slices/authSlice";

// 鉴权白名单（不需要登录即可访问的页面）
const AUTH_WHITELIST = ["/login", "/register", "/pricing", "/"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 检查是否在白名单中
    const isPublicPath = AUTH_WHITELIST.some(path => 
      pathname === path || (path !== "/" && pathname.startsWith(path))
    );

    if (isPublicPath) {
      return;
    }

    // 检查是否有 token
    const token = localStorage.getItem("token");
    if (!token) {
      // 无 token，重定向到登录页，并记录当前页面以便登录后跳转回来
      dispatch(logout());
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
    } else if (!isAuthenticated) {
      // 有 token 但 redux 状态未同步（可能是刷新页面），尝试恢复状态
      const userStr = localStorage.getItem("auth_user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch(login({ user, token }));
        } catch {
          dispatch(logout());
          router.push('/login');
        }
      } else {
        // 有 token 但无用户信息，视为无效登录
        dispatch(logout());
        router.push('/login');
      }
    }
  }, [pathname, router, isAuthenticated, dispatch]);

  // 如果未授权且不在白名单，暂时不渲染内容（防止闪烁）
  const isPublicPath = AUTH_WHITELIST.some(path => 
    pathname === path || (path !== "/" && pathname.startsWith(path))
  );
  
  if (!isAuthenticated && !isPublicPath) {
    // 检查本地是否有 token，如果有则可能是正在恢复状态，显示 loading 或空
    // 如果没有 token，则会由 useEffect 触发跳转
    // 这里简单处理：如果有 token，暂时渲染 children（等待状态恢复），否则不渲染
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        // 允许渲染，等待 useEffect 恢复状态或跳转
    } else {
        return null;
    }
  }

  return <>{children}</>;
}
