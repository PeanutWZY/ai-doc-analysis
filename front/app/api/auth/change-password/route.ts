export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as unknown))
  const { currentPassword, newPassword } = body as {
    currentPassword?: string
    newPassword?: string
  }

  if (!currentPassword || !newPassword) {
    return Response.json({ code: 400, message: "缺少参数" }, { status: 400 })
  }
  if (String(newPassword).length < 6) {
    return Response.json({ code: 400, message: "新密码至少 6 位" }, { status: 400 })
  }

  return Response.json({ code: 0, message: "ok" }, { status: 200 })
}

