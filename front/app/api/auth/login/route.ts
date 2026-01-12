import Mock from "mockjs"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as unknown))
  const { email, password } = body as { email?: string; password?: string }
  if (!email || !password) {
    return Response.json({ code: 400, message: "缺少参数" }, { status: 400 })
  }
  const data = Mock.mock({
    token: "@guid",
    user: {
      id: "@integer(1, 99999)",
      username: "@name",
      email,
    },
  })
  return Response.json({ code: 0, message: "ok", data }, { status: 200 })
}
