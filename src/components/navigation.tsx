
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, ShoppingBag, Calculator, Home, History, User, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/firebase"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "BMI & AI Plan", href: "/bmi", icon: Calculator },
  { name: "Workouts", href: "/workout", icon: History },
  { name: "The Vault", href: "/shop", icon: ShoppingBag },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, loading } = useUser()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:top-0 md:bottom-auto md:border-t-0 md:border-b h-16 px-4">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <Link href="/" className="hidden md:flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center candy-red-glow">
            <Dumbbell className="text-white w-5 h-5" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-primary">ForgeFit</span>
        </Link>

        <div className="flex w-full md:w-auto items-center justify-around md:justify-end gap-1 md:gap-8">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-md transition-all",
                  isActive 
                    ? "text-primary md:bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(242,13,13,0.5)]")} />
                <span className="text-[10px] md:text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
          
          <div className="md:ml-4 border-l border-border pl-4 hidden md:block">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : user ? (
              <Link href="/profile" className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border border-primary/50">
                  <AvatarImage src={user.photoURL || ''} />
                  <AvatarFallback className="bg-secondary text-[10px] font-bold">
                    {user.displayName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link 
                href="/login" 
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-all border border-primary/50 text-primary font-bold hover:bg-primary/10",
                  pathname === '/login' && "bg-primary text-white"
                )}
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
