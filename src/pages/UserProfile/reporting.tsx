"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useUserSettingsStore } from "@/stores/userSettingsStore"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

const ReportingFormSchema = z.object({
  defaultTimeRange: z.string().min(1, {
    message: "Default time range is required.",
  }),
  autoRefresh: z.boolean(),
  refreshInterval: z.number().min(5, {
    message: "Refresh interval must be at least 5 seconds.",
  }).max(3600, {
    message: "Refresh interval cannot exceed 1 hour.",
  }),
  exportFormat: z.enum(['csv', 'json', 'pdf']),
  includeMetadata: z.boolean(),
  emailReports: z.boolean(),
  emailFrequency: z.enum(['daily', 'weekly', 'monthly', 'never']),
})

export function SectionReporting() {
  const { reportSettings, updateReportSettings, resetReportSettings } = useUserSettingsStore()
  
  const form = useForm<z.infer<typeof ReportingFormSchema>>({
    resolver: zodResolver(ReportingFormSchema),
    defaultValues: {
      defaultTimeRange: reportSettings.defaultTimeRange,
      autoRefresh: reportSettings.autoRefresh,
      refreshInterval: reportSettings.refreshInterval,
      exportFormat: reportSettings.exportFormat,
      includeMetadata: reportSettings.includeMetadata,
      emailReports: reportSettings.emailReports,
      emailFrequency: reportSettings.emailFrequency,
    },
  })

  function onSubmit(data: z.infer<typeof ReportingFormSchema>) {
    try {
      updateReportSettings(data)
      toast.success("Report settings saved", {
        description: "Your report preferences have been updated successfully.",
      })
    } catch (error) {
      toast.error("Failed to save settings", {
        description: "There was an error saving your report settings. Please try again.",
      })
    }
  }

  function handleReset() {
    resetReportSettings()
    form.reset({
      defaultTimeRange: '1h',
      autoRefresh: false,
      refreshInterval: 30,
      exportFormat: 'csv',
      includeMetadata: true,
      emailReports: false,
      emailFrequency: 'never',
    })
    toast.info("Report settings reset", {
      description: "All report settings have been restored to their default values.",
    })
  }

  return (
    <Card className="w-9/10 m-auto">
      <CardHeader>
        <CardTitle>Report Settings</CardTitle>
        <CardDescription>
          Configure default report preferences and export options.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="defaultTimeRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Time Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select default time range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15m">15 minutes</SelectItem>
                        <SelectItem value="30m">30 minutes</SelectItem>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="3h">3 hours</SelectItem>
                        <SelectItem value="6h">6 hours</SelectItem>
                        <SelectItem value="12h">12 hours</SelectItem>
                        <SelectItem value="1d">1 day</SelectItem>
                        <SelectItem value="3d">3 days</SelectItem>
                        <SelectItem value="7d">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the default time range for new reports and queries.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exportFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Export Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select export format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the default format for exported reports.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="autoRefresh"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Auto Refresh</FormLabel>
                      <FormDescription>
                        Automatically refresh data at the specified interval.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('autoRefresh') && (
                <FormField
                  control={form.control}
                  name="refreshInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refresh Interval (seconds)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="30"
                          min={5}
                          max={3600}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        How often to refresh data (5-3600 seconds).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="includeMetadata"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Include Metadata</FormLabel>
                      <FormDescription>
                        Include additional metadata in exported reports.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailReports"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Reports</FormLabel>
                      <FormDescription>
                        Receive reports via email at the specified frequency.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('emailReports') && (
                <FormField
                  control={form.control}
                  name="emailFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select email frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often to receive email reports.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                Reset to Defaults
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}