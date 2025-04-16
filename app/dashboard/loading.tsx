import { Skeleton } from "@/components/ui/skeleton"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-[250px] mb-8" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
