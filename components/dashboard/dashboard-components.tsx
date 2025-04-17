import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LucideIcon } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  count?: number
  status?: string
  className?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, count, status, className }: StatCardProps) {
  return (
    <Card className={`bg-white ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {status && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {status}
            </Badge>
          )}
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-primary">
              {typeof value === 'number' ? `₱${value.toLocaleString()}` : value}
            </p>
            {subtitle && (
              <p className="ml-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {count !== undefined && (
            <p className="mt-1 text-sm text-muted-foreground">
              {count} {count === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface CashflowChartProps {
  data: {
    income: number
    expenses: number
    net: number
    dateRange: string
  }
}

export function CashflowChart({ data }: CashflowChartProps) {
  // Sample data for the last 12 months
  const monthlyData = [
    { name: "Jan", income: 20500, expenses: 7830, net: 12670 },
    { name: "Feb", income: 18200, expenses: 6900, net: 11300 },
    { name: "Mar", income: 22000, expenses: 8100, net: 13900 },
    { name: "Apr", income: 19800, expenses: 7200, net: 12600 },
    { name: "May", income: 21500, expenses: 7900, net: 13600 },
    { name: "Jun", income: 23000, expenses: 8500, net: 14500 },
    { name: "Jul", income: 20800, expenses: 7600, net: 13200 },
    { name: "Aug", income: 19500, expenses: 7100, net: 12400 },
    { name: "Sep", income: 21000, expenses: 7800, net: 13200 },
    { name: "Oct", income: 22500, expenses: 8200, net: 14300 },
    { name: "Nov", income: 24000, expenses: 8800, net: 15200 },
    { name: "Dec", income: 20500, expenses: 7830, net: 12670 },
  ]

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 gap-4">
        <div>
          <CardTitle className="text-base font-semibold">Cashflow</CardTitle>
          <CardDescription>{data.dateRange}</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">INCOME</span>
            <span className="font-medium">₱{data.income.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-200" />
            <span className="text-sm text-muted-foreground">EXPENSES</span>
            <span className="font-medium">₱{data.expenses.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-900" />
            <span className="text-sm text-muted-foreground">NET</span>
            <span className="font-medium">₱{data.net.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 min-h-[300px]">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#93c5fd" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `₱${value/1000}k`}
                width={60}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`₱${value.toLocaleString()}`, '']}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#93c5fd"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface ExpenseCategoryProps {
  categories: {
    name: string
    amount: number
    color: string
  }[]
}

export function ExpenseCategories({ categories }: ExpenseCategoryProps) {
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0)

  // Enhanced data for the pie chart
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs sm:text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader className="p-6">
        <CardTitle className="text-base font-semibold">Top expense categories</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="relative w-full max-w-[300px] mx-auto aspect-square">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">Total</div>
              <div className="text-2xl font-semibold">₱{total.toLocaleString()}</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₱${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-sm font-medium truncate">{category.name}</span>
              <span className="ml-auto text-sm text-muted-foreground whitespace-nowrap">
                ₱{category.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface RentalCardProps {
  id: string
  customerName: string
  equipment: string
  status: "active" | "pending" | "completed"
  duration: string
  customerAvatar?: string
}

export function RentalCard({ id, customerName, equipment, status, duration, customerAvatar }: RentalCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Rental #{id}</CardTitle>
            <CardDescription>Created on {new Date().toLocaleDateString()}</CardDescription>
          </div>
          <Badge variant={status === "active" ? "default" : status === "pending" ? "secondary" : "outline"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={customerAvatar} />
              <AvatarFallback>{customerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{customerName}</p>
              <p className="text-xs text-muted-foreground">Customer</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Equipment</p>
            <p className="text-sm text-muted-foreground">{equipment}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm text-muted-foreground">{duration}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          View Contract
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            Download
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            Manage
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

interface EquipmentCardProps {
  name: string
  description: string
  status: "available" | "rented" | "maintenance"
  serialNumber: string
  dailyRate: number
}

export function EquipmentCard({ name, description, status, serialNumber, dailyRate }: EquipmentCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <Badge variant={status === "available" ? "default" : status === "rented" ? "secondary" : "outline"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid gap-2">
          <div>
            <p className="text-sm font-medium">Serial Number</p>
            <p className="text-sm text-muted-foreground">{serialNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Daily Rate</p>
            <p className="text-sm text-muted-foreground">₱{dailyRate}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
} 