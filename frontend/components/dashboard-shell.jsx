import React from "react"


export function DashboardShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-4">{children}</div>
      </main>
    </div>
  )
}

