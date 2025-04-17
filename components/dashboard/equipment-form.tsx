"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const equipmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
  status: z.enum(["Available", "In Repair", "Rented", "Reserved", "Retired"]),
  quantity_available: z.number().min(0, "Quantity must be 0 or greater"),
  image_url: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
  rental_rates: z.array(
    z.object({
      min_days: z.number().min(1, "Minimum days must be at least 1"),
      max_days: z.number().min(1, "Maximum days must be at least 1"),
      daily_rate: z.number().min(0, "Daily rate must be 0 or greater"),
    })
  ).min(1, "At least one rental rate is required"),
})

type EquipmentFormValues = z.infer<typeof equipmentSchema>

interface EquipmentFormProps {
  initialData?: any
}

export function EquipmentForm({ initialData }: EquipmentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "",
      description: initialData?.description || "",
      status: initialData?.status || "Available",
      quantity_available: initialData?.quantity_available || 1,
      image_url: initialData?.image_url || "",
      notes: initialData?.notes || "",
      is_active: initialData?.is_active ?? true,
      rental_rates: initialData?.rental_rates || [
        { min_days: 1, max_days: 7, daily_rate: 0 }
      ],
    },
  })

  const onSubmit = async (data: EquipmentFormValues) => {
    try {
      setIsLoading(true)
      console.log('Submitting equipment data:', data)

      const response = await fetch("/api/equipment", {
        method: initialData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          equipment_id: initialData?.equipment_id,
        }),
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        console.error('Error response:', responseData)
        throw new Error(responseData.error || "Failed to save equipment")
      }

      console.log('Equipment saved successfully:', responseData)
      toast.success("Equipment saved successfully")
      router.refresh()
      router.push("/dashboard/equipment")
    } catch (error) {
      console.error('Error saving equipment:', error)
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Equipment name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="camera">Camera</SelectItem>
                    <SelectItem value="lens">Lens</SelectItem>
                    <SelectItem value="lighting">Lighting</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Equipment description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="In Repair">In Repair</SelectItem>
                    <SelectItem value="Rented">Rented</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity_available"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity Available</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Rental Rates</h3>
          {form.watch("rental_rates").map((_, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name={`rental_rates.${index}.min_days`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`rental_rates.${index}.max_days`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`rental_rates.${index}.daily_rate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const rates = form.getValues("rental_rates")
              form.setValue("rental_rates", [
                ...rates,
                { min_days: 1, max_days: 7, daily_rate: 0 },
              ])
            }}
          >
            Add Another Rate
          </Button>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Equipment"}
        </Button>
      </form>
    </Form>
  )
} 