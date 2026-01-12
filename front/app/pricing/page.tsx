"use client"

import { useMemo, useRef, useState } from "react"
import CustomLayout from "@/components/layout"

type PlanId = "starter" | "business" | "preferred" | "enterprise"

type Plan = {
  id: PlanId
  badge: string
  displayTitle: string
  features: string[]
  cta: string
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
    >
      ✓
    </span>
  )
}

export default function PricingPage() {
  const plans = useMemo<Plan[]>(
    () => [
      {
        id: "starter",
        badge: "起动机",
        displayTitle: "自由的",
        features: ["100 credits per month", "300 credits upon sign up", "完全 API 访问权限", "无需信用卡"],
        cta: "选择",
      },
      {
        id: "business",
        badge: "商业",
        displayTitle: "99美元/月",
        features: [
          "2500 credits per month",
          "超额费用为每信用额度 0.08 美元",
          "完全 API 访问权限",
          "客户支持",
          "数据保留政策",
          "HIPAA 合规性业务伙伴协议",
        ],
        cta: "选择",
      },
      {
        id: "preferred",
        badge: "优质的",
        displayTitle: "499美元/月",
        features: [
          "20000 credits per month",
          "超额费用为每积分 0.05 美元",
          "完全 API 访问权限",
          "优先支持",
          "数据保留政策",
          "HIPAA 合规性业务伙伴协议",
          "共享团队工作区",
          "生产环境 + 开发环境",
        ],
        cta: "选择",
      },
      {
        id: "enterprise",
        badge: "企业",
        displayTitle: "接触",
        features: [
          "定制定价",
          "随需量最小",
          "完全 API 访问权限",
          "优先支持",
          "数据保留政策",
          "HIPAA 合规性业务伙伴协议",
          "共享团队工作区",
          "生产环境 + 开发环境",
          "保证正常运行时间的服务水平协议",
        ],
        cta: "联系我们",
      },
    ],
    [],
  )

  const [selectedPlan, setSelectedPlan] = useState<PlanId>("business")
  const creditCostRef = useRef<HTMLElement | null>(null)

  const creditCostItems = useMemo(
    () => [
      {
        key: "parse",
        name: "解析",
        description: "上传文档进行解析：OCR识别、表格提取、极速建档、读取问答检测",
        unit: "每页 1 张",
        tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: "📄",
      },
      {
        key: "standardization",
        name: "标准化",
        description: "将文档标准化为结构化格式，无论是否使用特定的格式。",
        unit: "每页 2 页",
        tone: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: "🧾",
      },
      {
        key: "schema",
        name: "模式",
        description: "从一个或多个文档创建新模式",
        unit: "每页 1 张",
        tone: "bg-violet-50 text-violet-700 border-violet-200",
        icon: "🧩",
      },
      {
        key: "analysis",
        name: "分析",
        description: "通过让出一组自由文本利用并获取自由文本来案架分析一个或多个文档。",
        unit: "每页 0.5",
        tone: "bg-amber-50 text-amber-700 border-amber-200",
        icon: "🔎",
      },
      {
        key: "split",
        name: "分裂",
        description: "使用AI工艺把长文档拆分成多个子文档",
        unit: "每页 0.2",
        tone: "bg-rose-50 text-rose-700 border-rose-200",
        icon: "✂️",
      },
      {
        key: "classify",
        name: "分类",
        description: "根据您自定义的类别对文档进行分类",
        unit: "每页 0.1",
        tone: "bg-sky-50 text-sky-700 border-sky-200",
        icon: "🏷️",
      },
      {
        key: "review",
        name: "审查",
        description: "在页面上用黄色记号标识不同内容来源",
        unit: "每页 2 页",
        tone: "bg-stone-50 text-stone-700 border-stone-200",
        icon: "🧠",
      },
      {
        key: "merge",
        name: "合并",
        description: "将多个文档合并成一个综合文档",
        unit: "每页 0.01",
        tone: "bg-pink-50 text-pink-700 border-pink-200",
        icon: "🧷",
      },
      {
        key: "query",
        name: "询问",
        description: "使用自然语言查询标准化文档，获取匹配文档",
        unit: "每次对话 2 次",
        tone: "bg-cyan-50 text-cyan-700 border-cyan-200",
        icon: "💬",
      },
      {
        key: "pipeline",
        name: "路线",
        description: "使用AI模式完成简单自动化任务支持到正确的模式",
        unit: "每次建造 1 次",
        tone: "bg-purple-50 text-purple-700 border-purple-200",
        icon: "🧪",
      },
    ],
    [],
  )

  function scrollToCreditCost() {
    creditCostRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <CustomLayout hasSider={false}>
      <section className="mx-auto max-w-6xl py-10">
        <div className="text-center">
          <div className="text-2xl font-semibold tracking-tight text-zinc-900">定价</div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const active = selectedPlan === plan.id
            return (
              <div
                key={plan.id}
                className={[
                  "rounded-md border bg-white shadow-sm transition-shadow",
                  active ? "border-emerald-600 shadow-md" : "border-black/10 hover:shadow-md",
                ].join(" ")}
              >
                <div className="px-6 pt-6 text-left">
                  <div className="text-xs font-semibold text-zinc-800">{plan.badge}</div>
                  <div className="mt-2 text-4xl leading-none font-semibold tracking-tight text-zinc-900">
                    {plan.displayTitle}
                  </div>
                </div>

                <div className="px-6 pt-4 pb-6 text-left">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-zinc-700">
                        <CheckIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={[
                        "h-11 w-full rounded-sm font-semibold shadow-sm transition-colors",
                        active
                          ? "bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900"
                          : "bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900",
                      ].join(" ")}
                    >
                      {plan.id === "enterprise"
                        ? plan.cta
                        : active
                          ? "已选择"
                          : plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 rounded-xl border border-emerald-200 bg-emerald-50/60 px-6 py-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-700">📊</div>
            <div className="text-left">
              <div className="text-sm font-semibold text-zinc-900">什么是学分？</div>
              <div className="mt-1 text-sm text-zinc-700">了解 DocuPipe 全套服务的估用成本</div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={scrollToCreditCost}
                  className="h-9 rounded-md border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  查看使用情况
                </button>
              </div>
            </div>
          </div>
        </div>

        <section
          ref={(node) => {
            creditCostRef.current = node
          }}
          className="mt-14"
        >
          <div className="text-center">
            <div className="text-2xl font-semibold tracking-tight text-zinc-900">信贷成本</div>
          </div>

          <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 shadow-sm backdrop-blur">
            <div className="p-4 sm:p-6 space-y-3">
              {creditCostItems.map((item) => (
                <div
                  key={item.key}
                  className="group rounded-xl border border-black/10 bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg border border-black/10 bg-white flex items-center justify-center text-base">
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-zinc-900">{item.name}</div>
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-600 line-clamp-2">
                        {item.description}
                      </div>
                    </div>

                    <div
                      className={[
                        "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold",
                        item.tone,
                      ].join(" ")}
                    >
                      {item.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </CustomLayout>
  )
}
