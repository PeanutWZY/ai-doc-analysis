'use client'

import { useState } from "react"
import { http } from "@/lib/request"
import Link from "next/link"
import { Input, Button, Alert, Typography } from "antd"

type RegisterResponse = {
  code: number
  message: string
  data?: {
    id: number
    name: string
    email: string
    createdAt: string
  }
}

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setUserId(null)
    if (password !== confirm) {
      setError("两次密码不一致")
      return
    }
    setLoading(true)
    try {
      const res = await http.post<RegisterResponse>("/auth/register", { email, password })
      if (res.code === 0 && res.data) {
        setUserId(res.data.id)
      } else {
        setError(res.message || "注册失败")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "请求错误"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-zinc-900 p-6">
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-4">注册</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">邮箱</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">密码</label>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">确认密码</label>
            <Input.Password
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="******"
              required
            />
          </div>
          {error && <Alert type="error" message={error} showIcon />}
          {userId && (
            <Alert
              type="success"
              message={
                <Typography.Text>
                  注册成功，用户ID：<span className="font-mono">{userId}</span>
                </Typography.Text>
              }
              showIcon
            />
          )}
          <Button type="primary" htmlType="submit" disabled={loading} block>
            {loading ? "提交中..." : "注册"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          已有账号？ <Link href="/login" className="text-blue-600">去登录</Link>
        </div>
      </div>
    </div>
  )
}
