'use client'

import { http } from "@/lib/request"
import Link from "next/link"
import { Card, Form, Input, Button, Alert, Typography, message } from "antd"
import { useState } from "react"

type LoginResponse = {
  code: number
  message: string
  data?: {
    token: string
    user: { id: number; name: string; email: string }
  }
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onFinish(values: { email: string; password: string }) {
    setError(null)
    setToken(null)
    setLoading(true)
    try {
      const res = await http.post<LoginResponse>("/auth/login", values)
      if (res.code === 0 && res.data) {
        setToken(res.data.token)
        message.success("登录成功")
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
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入邮箱" }, { type: "email", message: "邮箱格式不正确" }]}
          >
            <Input placeholder="you@example.com" />
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
