'use client'

import { http } from "@/lib/request"
import Link from "next/link"
import { Card, Form, Input, Button, Alert, Typography, message } from "antd"
import { useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { login } from "@/store/slices/authSlice"

type LoginResponse = {
  code: number
  message: string
  data?: {
    token: string
    user: { id: number; username: string; email: string }
  }
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  async function onFinish(values: { name: string; password: string }) {
    setError(null)
    setLoading(true)
    try {
      const res = await http.post<LoginResponse>("/auth/login", values)
      if (res.code === 0 && res.data) {
        dispatch(login({ user: res.data.user, token: res.data.token }))
        message.success("登录成功")
        // 登录成功后跳转到首页或之前的页面
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('returnUrl');
        window.location.href = returnUrl ? decodeURIComponent(returnUrl) : '/'
      } else {
        setError(res.message || "登录失败")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "请求错误"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <Card title="登录" className="w-full max-w-md">
        {error && <Alert type="error" message={error} showIcon className="mb-4" />}
        {token && (
          <Alert
            type="success"
            message={
              <Typography.Text>
                登录成功，令牌：<span className="font-mono break-all">{token}</span>
              </Typography.Text>
            }
            showIcon
            className="mb-4"
          />
        )}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="用户名或者邮箱"
            name="name"
            rules={[{ required: true, message: "请输入用户名或者邮箱" }]}
          >
            <Input placeholder="请输入用户名或者邮箱" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password placeholder="******" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="text-sm">
          没有账号？ <Link href="/register">去注册</Link>
        </div>
      </Card>
    </div>
  )
}
