"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useUserSettingsStore } from "@/stores/userSettingsStore"
import { usePlaylistStore } from "@/stores/playlistStore"
import { useThemeStore } from "@/stores/themeStore"

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
import { ChromePicker } from 'react-color'
import { useState } from 'react'
import { COLOR_PALETTE } from '@/lib/colorUtils'

const ThemingFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: "Please enter a valid hex color (e.g., #3b82f6)",
  }),
  fontSize: z.enum(['small', 'medium', 'large']),
  compactMode: z.boolean(),
  showAnimations: z.boolean(),
  timelineUseColorPalette: z.boolean(),
  timelineColoredLabels: z.boolean(),
  timelineColoredTransmissionBars: z.boolean(),
  timelineCompactAxisLabels: z.boolean(),
})

export function SectionTheming() {
  const { theming, updateTheming, resetTheming, updateCustomColor } = useUserSettingsStore()
  const { refreshChannelColors } = usePlaylistStore()
  const { setDarkMode } = useThemeStore()
  const [openColorPicker, setOpenColorPicker] = useState<number | null>(null)
  
  // Add loading state
  if (!theming || !COLOR_PALETTE) {
    return (
      <Card className="w-9/10 m-auto">
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Loading theme settings...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const form = useForm<z.infer<typeof ThemingFormSchema>>({
    resolver: zodResolver(ThemingFormSchema),
    defaultValues: {
      theme: theming?.theme || 'system',
      primaryColor: theming?.primaryColor || '#3b82f6',
      fontSize: theming?.fontSize || 'medium',
      compactMode: theming?.compactMode || false,
      showAnimations: theming?.showAnimations || true,
      timelineUseColorPalette: theming?.timelineUseColorPalette ?? true,
      timelineColoredLabels: theming?.timelineColoredLabels ?? true,
      timelineColoredTransmissionBars: theming?.timelineColoredTransmissionBars ?? true,
      timelineCompactAxisLabels: theming?.timelineCompactAxisLabels ?? false,
    },
  })

  function onSubmit(data: z.infer<typeof ThemingFormSchema>) {
    try {
      updateTheming(data)
      
      // Apply theme changes immediately
      if (data.theme === 'dark') {
        setDarkMode(true)
      } else if (data.theme === 'light') {
        setDarkMode(false)
      } else if (data.theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setDarkMode(systemPrefersDark)
      }
      
      toast.success("Theme settings saved", {
        description: "Your theme preferences have been updated successfully.",
      })
    } catch (error) {
      toast.error("Failed to save settings", {
        description: "There was an error saving your theme settings. Please try again.",
      })
    }
  }

  function handleReset() {
    resetTheming()
    form.reset({
      theme: 'system',
      primaryColor: '#3b82f6',
      fontSize: 'medium',
      compactMode: false,
      showAnimations: true,
      timelineUseColorPalette: true,
      timelineColoredLabels: true,
      timelineColoredTransmissionBars: true,
      timelineCompactAxisLabels: false,
    })
    toast.info("Theme settings reset", {
      description: "All theme settings have been restored to their default values.",
    })
  }

  return (
    <Card className="w-9/10 m-auto">
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Customize the appearance and behavior of the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose between light, dark, or follow your system preference.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Timeline Configuration Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Timeline Configuration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure how the transmission timeline displays channel colors and labels.
                </p>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="timelineUseColorPalette"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Use Color Palette for Rows
                        </FormLabel>
                        <FormDescription>
                          When enabled, timeline rows use colors from the color palette. When disabled, 
                          rows use alternating grayscale colors.
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
                  name="timelineColoredLabels"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Colored Channel Labels
                        </FormLabel>
                        <FormDescription>
                          When enabled, channel labels use their assigned colors. When disabled, 
                          labels use gray text.
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
                  name="timelineColoredTransmissionBars"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Colored Transmission Bars
                        </FormLabel>
                        <FormDescription>
                          When enabled, transmission bars use colors from the palette. When disabled, 
                          bars use grayscale colors.
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
                  name="timelineCompactAxisLabels"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Compact Time Axis Labels
                        </FormLabel>
                        <FormDescription>
                          When enabled, time axis labels use a compact card-style format with stacked day, date, and time. 
                          When disabled, labels use the traditional horizontal format.
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
              </div>
            </div>

            {/* Color Customization Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Color Palette Customization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize the colors used throughout the application. These colors are used for channels, 
                  talk groups, and other UI elements. Changes will be applied immediately.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                {!COLOR_PALETTE ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">Color palette not available</p>
                  </div>
                ) : COLOR_PALETTE.map((color, index) => {
                  const customColor = theming?.customColors?.[index]
                  const currentColor = customColor || color
                  
                  return (
                    <div key={index} className="relative">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div 
                            className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: currentColor }}
                            onClick={() => setOpenColorPicker(openColorPicker === index ? null : index)}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Color {index + 1}</p>
                          <p className="text-xs text-muted-foreground">{currentColor}</p>
                        </div>
                        {customColor && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              try {
                                updateCustomColor(index, color)
                                refreshChannelColors() // Refresh channel colors with reset color
                                toast.info(`Color ${index + 1} reset to default`)
                              } catch (error) {
                                console.error('Error resetting color:', error)
                                toast.error('Failed to reset color')
                              }
                            }}
                            className="text-xs"
                          >
                            Reset
                          </Button>
                        )}
                      </div>
                      
                      {/* Color Picker Popup */}
                      {openColorPicker === index && (
                        <div className="absolute z-10 mt-2">
                          <div 
                            className="fixed inset-0" 
                            onClick={() => setOpenColorPicker(null)}
                          />
                          <ChromePicker
                            color={currentColor}
                            onChange={(color) => {
                              try {
                                updateCustomColor(index, color.hex)
                                refreshChannelColors() // Refresh channel colors with new custom color
                                toast.success(`Color ${index + 1} updated`)
                              } catch (error) {
                                console.error('Error updating color:', error)
                                toast.error('Failed to update color')
                              }
                            }}
                            disableAlpha={true}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
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