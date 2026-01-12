'use client'

import { useState } from "react"
import { Form, Input, Modal, message } from "antd"
import { http } from "@/lib/request"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateUser } from "@/store/slices/authSlice"

type ChangePasswordResponse = { code: number; message: string }

export default function SettingsGeneralPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm<{
    username: string
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>()

  function openEdit() {
    setEditOpen(true)
    form.setFieldsValue({
      username: user?.username ?? "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  function closeEdit() {
    setEditOpen(false)
    form.resetFields()
  }

  async function saveProfile(values: {
    username: string
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }) {
    let { username, currentPassword, newPassword, confirmPassword } = values
    username = username.trim()

    const usernameChanged = username && (username !== (user?.username ?? ""))

    currentPassword = values.currentPassword ?? ""
    newPassword = values.newPassword ?? ""
    confirmPassword = values.confirmPassword ?? ""
    const passwordTouched = Boolean(currentPassword || newPassword || confirmPassword)

    setSaving(true)
    try {
      if (usernameChanged || passwordTouched) {
        const res = await http.post<ChangePasswordResponse>("/user/update", {
          username,
          currentPassword,
          newPassword,
        })
        if (res.code !== 0) {
          message.error(res.message || "密码修改失败")
          return
        } else {
          dispatch(updateUser({ username, email: user?.email ?? "", id: user?.id ?? 0 }))
        }
      } else {
        message.info("未修改任何内容")
        return
      }

      message.success(passwordTouched ? "资料与密码已更新" : "用户名已更新")
      setEditOpen(false)
      form.resetFields()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "请求错误"
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-black/10 bg-white">
        <div className="px-5 py-4 flex items-center justify-between border-b border-black/10">
          <div className="text-sm font-semibold text-zinc-900">基础</div>
          <button
            type="button"
            className="h-8 w-8 rounded-md flex items-center justify-center text-zinc-500 hover:bg-black/5 hover:text-zinc-900 transition-colors"
            aria-label="Edit username"
            onClick={openEdit}
          >
            ✎
          </button>
        </div>
        <div className="px-5 py-4 space-y-4 text-left">
          <div>
            <div className="text-xs text-zinc-500">用户名</div>
            <div className="mt-1 text-sm text-zinc-900">{user?.username || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">邮箱</div>
            <div className="mt-1 text-sm text-zinc-900">{user?.email || "-"}</div>
          </div>
        </div>
      </section>

      <Modal
        title="修改资料"
        open={editOpen}
        okText="保存"
        cancelText="取消"
        confirmLoading={saving}
        onOk={() => form.submit()}
        onCancel={closeEdit}
      >
        <Form form={form} layout="vertical" onFinish={saveProfile} className="space-y-5">
          <div className="space-y-2">
            <div className="text-sm text-zinc-700">用户名</div>
            <Form.Item
              name="username"
              rules={[
                {
                  validator: async (_, value: unknown) => {
                    const text = typeof value === "string" ? value.trim() : ""
                    if (!text) throw new Error("请输入用户名")
                    if (text.length < 2) throw new Error("用户名至少 2 个字符")
                  },
                },
              ]}
            >
              <Input placeholder="请输入用户名" autoFocus maxLength={20} />
            </Form.Item>
          </div>

          <div className="border-t border-black/10 pt-4 space-y-3">
            <div className="text-sm font-medium text-zinc-900">修改密码</div>
            <div className="space-y-2">
              <div className="text-sm text-zinc-700">当前密码</div>
              <Form.Item
                name="currentPassword"
                dependencies={["newPassword", "confirmPassword"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator: async (_, value: unknown) => {
                      const current = typeof value === "string" ? value : ""
                      const next = typeof getFieldValue("newPassword") === "string" ? getFieldValue("newPassword") : ""
                      const confirm =
                        typeof getFieldValue("confirmPassword") === "string" ? getFieldValue("confirmPassword") : ""
                      const touched = Boolean(current || next || confirm)
                      if (!touched) return
                      if (!current) throw new Error("请输入当前密码")
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="请输入当前密码" />
              </Form.Item>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-zinc-700">新密码</div>
              <Form.Item
                name="newPassword"
                dependencies={["currentPassword", "confirmPassword"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator: async (_, value: unknown) => {
                      const next = typeof value === "string" ? value : ""
                      const current =
                        typeof getFieldValue("currentPassword") === "string" ? getFieldValue("currentPassword") : ""
                      const confirm =
                        typeof getFieldValue("confirmPassword") === "string" ? getFieldValue("confirmPassword") : ""
                      const touched = Boolean(current || next || confirm)
                      if (!touched) return
                      if (!next) throw new Error("请输入新密码")
                      if (next.length < 6) throw new Error("新密码至少 6 位")
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="至少 6 位" />
              </Form.Item>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-zinc-700">确认新密码</div>
              <Form.Item
                name="confirmPassword"
                dependencies={["currentPassword", "newPassword"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator: async (_, value: unknown) => {
                      const confirm = typeof value === "string" ? value : ""
                      const current =
                        typeof getFieldValue("currentPassword") === "string" ? getFieldValue("currentPassword") : ""
                      const next = typeof getFieldValue("newPassword") === "string" ? getFieldValue("newPassword") : ""
                      const touched = Boolean(current || next || confirm)
                      if (!touched) return
                      if (!confirm) throw new Error("请确认新密码")
                      if (confirm !== next) throw new Error("两次新密码不一致")
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="再次输入新密码" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>

      <section className="rounded-xl border border-black/10 bg-white">
        <div className="px-5 py-4 flex items-center justify-between border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-zinc-900">方案</div>
            <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700">
              基础
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 h-8 px-3 rounded-md border border-emerald-600/30 bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors"
          >
            升级方案 <span className="text-xs leading-none">↗</span>
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-black/10 bg-white px-4 py-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-emerald-600">🏷</span>
                <span>每月费用</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-zinc-900">免费</div>
            </div>

            <div className="rounded-lg border border-black/10 bg-white px-4 py-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-emerald-600">🗓</span>
                <span>续期日期</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-zinc-900">—</div>
            </div>

            <div className="rounded-lg border border-black/10 bg-white px-4 py-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-emerald-600">🧾</span>
                <span>可用额度</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-zinc-900">300 / 100</div>
            </div>

            <div className="rounded-lg border border-black/10 bg-white px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="text-emerald-600">📈</span>
                  <span>是否超出额度</span>
                </div>
                <div className="h-5 w-10 rounded-full bg-zinc-200 relative">
                  <div className="h-4 w-4 rounded-full bg-white absolute top-0.5 left-0.5 shadow-sm" />
                </div>
              </div>
              <div className="mt-2 text-sm font-semibold text-zinc-900">否</div>
              <div className="mt-1 text-xs text-zinc-500">超出额度后是否禁用</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
