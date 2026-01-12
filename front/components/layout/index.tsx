"use client";

import React, { useCallback, useMemo } from "react";
import type { MenuProps } from "antd";
import { Avatar, Button, Dropdown, Layout, Menu, theme } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

interface CustomLayoutProps {
  children: React.ReactNode;
  hasSider?: boolean;
  menuItems?: MenuProps["items"];
}

const CustomLayout: React.FC<CustomLayoutProps> = ({
  children,
  hasSider = true,
  menuItems = [],
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.replace('/login');
  }, [dispatch, router]);

  const avatarText = useMemo(() => {
    const value = user?.username?.trim();
    return value ? value.slice(0, 1).toUpperCase() : "U";
  }, [user?.username]);

  const userMenuItems = useMemo<MenuProps["items"]>(() => {
    return [
      {
        key: "username",
        disabled: true,
        label: (
          <div className="py-1">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              用户名
            </div>
            <div className="text-sm text-zinc-900">
              {user?.username || "未登录"}
            </div>
          </div>
        ),
      },
      {
        key: "email",
        disabled: true,
        label: (
          <div className="py-1">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">邮箱</div>
            <div className="text-sm text-zinc-900">{user?.email || "-"}</div>
          </div>
        ),
      },
      { type: "divider" },
      {
        key: "settings",
        label: <Link href="/settings">设置</Link>,
      },
      {
        key: "logout",
        label: "登出",
        danger: true,
        onClick: handleLogout,
      },
    ];
  }, [handleLogout, user?.email, user?.username]);

  return (
    <Layout hasSider={hasSider}>
      {hasSider && (
        <Sider style={siderStyle}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["4"]}
            items={menuItems}
          />
        </Sider>
      )}

      <Layout>
        <Header style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div className="w-full h-full px-6 flex items-center justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              <span className="text-zinc-500 dark:text-zinc-400"></span>
              <span className="mx-1 text-zinc-400">/</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                AI文档分析
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Credits
              </div>
              <Button size="small">⟳</Button>
              <Link href="/documents/upload">
                <Button type="primary" size="small">
                  Upload
                </Button>
              </Link>
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["hover"]}
                placement="bottomRight">
                <Avatar size={32} style={{ backgroundColor: "#10b981" }}>
                  {avatarText}
                </Avatar>
              </Dropdown>
            </div>
          </div>
        </Header>

        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          { process.env.NEXT_PUBLIC_PROJECT_NAME } © {new Date().getFullYear()} created by PeanutWZY
        </Footer>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
