import Link from "next/link"
import { Mountain, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-display text-2xl text-primary">Rocktober Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}
