'use client'
import { useRouter } from 'next/navigation';
import { useMemo, useState } from "react"
import { http } from "@/lib/request"
import Link from "next/link"
import { Input, Button, Alert, Typography, message } from "antd"

type RegisterResponse = {
  code: number
  message: string
  data?: {
    id: number
    username: string
    email: string
    createdAt: string
  }
}

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter();

  const isValid = useMemo(() => {
    const nameOk = username.trim().length >= 3
    const emailOk = /\S+@\S+\.\S+/.test(email)
    const passOk = password.length >= 6
    const matchOk = password === confirm
    return nameOk && emailOk && passOk && matchOk
  }, [username, email, password, confirm])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setUserId(null)
    if (password !== confirm) {
      setError("两次密码不一致")
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("邮箱格式不正确")
      return
    }
    if (username.trim().length < 3) {
      setError("用户名至少 3 个字符")
      return
    }
    if (password.length < 6) {
      setError("密码至少 6 位")
      return
    }
    setLoading(true)

    try {
      const res = await http.post<RegisterResponse>("/auth/register", { username, email, password })
      if (res.code === 0 && res.data) {
        setUserId(res.data.id)
        message.success("注册成功")
        // 注册成功后跳转到登录页
        router.push('/login')
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
            <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">用户名</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
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
          <Button type="primary" htmlType="submit" disabled={loading || !isValid} block>
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
