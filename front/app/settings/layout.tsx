"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import CustomLayout from "@/components/layout";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/settings";
  const tabs = useMemo(
    () => [
      { key: "general", label: "常规", href: "/settings/general" },
      { key: "billing", label: "账单", href: "/settings/billing" },
    ],
    []
  );

  return (
    <CustomLayout hasSider={false}>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/documents/overview"
          className="w-full inline-flex gap-2 text-sm text-zinc-600 hover:text-zinc-900 self-start">
          <span className="text-base leading-none">←</span>
          <span>返回仪表盘</span>
        </Link>

        <div className="mt-6 border-b border-black/10">
          <div className="flex items-center gap-6 text-sm">
            {tabs.map((t) => {
              const active =
                pathname === t.href || pathname.startsWith(`${t.href}/`);
              return (
                <Link
                  key={t.key}
                  href={t.href}
                  className={[
                    "pb-3 -mb-px border-b-2 transition-colors",
                    active
                      ? "border-emerald-600 text-emerald-700"
                      : "border-transparent text-zinc-500 hover:text-zinc-900",
                  ].join(" ")}>
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </CustomLayout>
  );
}
