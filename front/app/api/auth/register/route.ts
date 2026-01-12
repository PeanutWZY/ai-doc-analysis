import Mock from "mockjs"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as unknown))
  const { username, email, password } = body as {
    username?: string
    email?: string
    password?: string
  }
  if (!username || !email || !password) {
    return Response.json({ code: 400, message: "缺少参数" }, { status: 400 })
  }
  const data = Mock.mock({
    id: "@integer(1, 99999)",
    username,
    email,
    createdAt: "@datetime",
  })
  return Response.json({ code: 0, message: "ok", data }, { status: 200 })
}
