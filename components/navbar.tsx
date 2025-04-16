import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"

export default function Navbar() {
  // For now, we'll use a placeholder user
  const user = {
    name: "User",
    image: null
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold">
            Your App
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <UserAvatar user={user} />
        </div>
      </div>
    </nav>
  )
} 