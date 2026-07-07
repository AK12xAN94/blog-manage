import { Suspense } from 'react'

export default function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="loading">加载中...</div>}>
      {children}
    </Suspense>
  )
}
