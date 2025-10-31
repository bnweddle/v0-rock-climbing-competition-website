import Link from "next/link"
import { Mountain } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="font-display text-2xl text-primary">Rocktober</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#rules" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Rules
          </Link>
          <Link href="/#enter" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Enter
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Leaderboard
          </Link>
          <Link href="/costumes" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Costumes
          </Link>
          <Link href="/bonuses" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Bonuses
          </Link>
          <Link href="/score" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Score Entry
          </Link>
        </nav>

        <Button asChild variant="outline" size="sm">
          <Link href="/admin">Admin</Link>
        </Button>
      </div>
    </header>
  )
}
