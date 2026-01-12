import Link from "next/link"

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const title = slug.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ")

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          页面主体结构已就绪，这里后续填充具体业务内容。
        </p>
        <div className="mt-4">
          <Link href="/documents/overview" className="text-emerald-700 dark:text-emerald-400">
            返回 Documents / Overview
          </Link>
        </div>
      </div>
    </div>
  )
}

