'use client'

import Link from "next/link"
import { Button } from "antd"

export default function DocumentsOverviewPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
          <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-semibold">
            D
          </div>
        </div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Bring your documents into DocuPipe
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Upload PDFs, images and spreadsheets to get started
        </p>
        <div className="mt-5 flex items-center justify-center">
          <Link href="/documents/upload">
            <Button type="primary">Upload Documents</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

