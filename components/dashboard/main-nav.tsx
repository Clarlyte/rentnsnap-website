import Link from "next/link"
import { Camera } from "lucide-react"

export function MainNav() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <Camera className="h-6 w-6 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-xl font-bold">
          Rent n&apos; <span className="text-gold-400">Snap</span>
        </span>
      </Link>
    </div>
  )
}

