import Link from "next/link";

export default function SettingsBillingPage() {
  return (
    <section className="rounded-2xl border border-emerald-800/50 bg-emerald-50/60 px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="h-16 w-16 rounded-full bg-emerald-200/50 flex items-center justify-center">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.5a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9Z"
                stroke="#166534"
                strokeWidth="1.6"
              />
              <path
                d="M7.5 11.25h9v9.25l-4.5-2-4.5 2v-9.25Z"
                stroke="#166534"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M12 5.2l.75 1.52 1.68.24-1.21 1.18.29 1.67L12 9.2l-1.5.8.29-1.67-1.21-1.18 1.68-.24L12 5.2Z"
                fill="#166534"
              />
            </svg>
          </div>

          <div className="max-w-xl">
            <div className="text-2xl font-semibold tracking-tight text-zinc-900">
              您目前使用的是免费套餐
            </div>
            <div className="mt-3 text-base leading-7 text-indigo-900/60">
              升级即可解锁更高级别的月度积分、团队协作工作区、团队高级支持以及更强大的型号。
            </div>
          </div>
        </div>

        <div className="flex sm:justify-end">
          <Link
            href="/pricing"
            type="button"
            className="h-12 px-10 rounded-lg bg-emerald-700 text-white font-semibold shadow-sm hover:bg-emerald-800 active:bg-emerald-900 transition-colors"
          >
            查看计划
          </Link>
        </div>
      </div>
    </section>
  )
}
