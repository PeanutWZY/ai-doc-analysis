'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, Button, Dropdown, type MenuProps } from "antd"
import { useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

type NavItem = { label: string; href: string }

function toTitleCase(input: string) {
  if (!input) return input
  return input.charAt(0).toUpperCase() + input.slice(1)
}

function getBreadcrumb(pathname: string) {
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean)
  const first = parts[0] ? toTitleCase(parts[0]) : "Home"
  const second = parts[1] ? toTitleCase(parts[1]) : "Overview"
  return { first, second }
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const pathname = usePathname() ?? "/"
  const router = useRouter()
  const { first, second } = getBreadcrumb(pathname)

  const documentsNav: NavItem[] = [
    { label: "Overview", href: "/documents/overview" },
    { label: "Upload", href: "/documents/upload" },
    { label: "Split", href: "/documents/split" },
    { label: "Merge", href: "/documents/merge" },
  ]

  const mainNav: NavItem[] = [
    { label: "Home", href: "/home" },
    { label: "Documents", href: "/documents/overview" },
    { label: "Schemas", href: "/schemas" },
    { label: "Standardization", href: "/standardization" },
    { label: "Classification", href: "/classification" },
    { label: "Review", href: "/review" },
    { label: "Analysis", href: "/analysis" },
    { label: "Query", href: "/query" },
    { label: "Workflows", href: "/workflows" },
    { label: "Jobs", href: "/jobs" },
  ]

  function isActive(href: string) {
    if (href === "/documents/overview") return pathname.startsWith("/documents")
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const avatarText = useMemo(() => {
    const value = user?.username?.trim()
    return value ? value.slice(0, 1).toUpperCase() : "U"
  }, [user?.username])

  const userMenuItems = useMemo<MenuProps["items"]>(() => {
    return [
      {
        key: "username",
        disabled: true,
        label: (
          <div className="py-1">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">用户名</div>
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
            <div className="text-sm text-zinc-900">
              {user?.email || "-"}
            </div>
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
        onClick: () => {
          logout()
          router.replace("/login")
          router.refresh()
        },
      },
    ]
  }, [logout, router, user?.email, user?.username])

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-black/10 dark:border-white/15 bg-white dark:bg-zinc-950">
          <div className="h-14 px-4 flex items-center border-b border-black/10 dark:border-white/15">
            <Link href="/documents/overview" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-semibold">
                D
              </div>
              <div className="font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                DOCUPIPE
              </div>
            </Link>
          </div>

          <nav className="px-3 py-3 text-sm">
            <div className="space-y-1">
              {mainNav.slice(0, 2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center justify-between rounded-md px-3 py-2 transition-colors",
                    isActive(item.href)
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-3">
              <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Documents
              </div>
              <div className="space-y-1">
                {documentsNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center rounded-md px-3 py-2 transition-colors",
                      isActive(item.href)
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-3 space-y-1">
              {mainNav.slice(2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center rounded-md px-3 py-2 transition-colors",
                    isActive(item.href)
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="mt-auto px-3 py-3 border-t border-black/10 dark:border-white/15">
            <div className="space-y-1 text-sm">
              <Link
                href="/resources"
                className="block rounded-md px-3 py-2 text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
              >
                Resources
              </Link>
              <Link
                href="/pricing"
                className="block rounded-md px-3 py-2 text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
              >
                Pricing
              </Link>
              <Link
                href="/settings"
                className="block rounded-md px-3 py-2 text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
              >
                Settings
              </Link>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="h-14 border-b border-black/10 dark:border-white/15 bg-white/80 dark:bg-zinc-950/60 backdrop-blur">
            <div className="h-full px-6 flex items-center justify-between">
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                <span className="text-zinc-500 dark:text-zinc-400">{first}</span>
                <span className="mx-1 text-zinc-400">/</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                  {second}
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
                  placement="bottomRight"
                >
                  <button
                    type="button"
                    className="ml-2 h-9 w-9 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-zinc-950 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <Avatar size={32} style={{ backgroundColor: "#10b981" }}>
                      {avatarText}
                    </Avatar>
                  </button>
                </Dropdown>
              </div>
            </div>
          </header>

          <main className="min-h-[calc(100vh-3.5rem)] bg-white dark:bg-black">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
