
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calculator, Loader2, Target, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generatePersonalizedFitnessPlan, type PersonalizedFitnessPlanOutput } from "@/ai/flows/personalized-fitness-plan-generation"
import { FitnessPlanDisplay } from "./fitness-plan-display"

const formSchema = z.object({
  height: z.coerce.number().min(50).max(300),
  weight: z.coerce.number().min(20).max(500),
  age: z.coerce.number().min(10).max(120),
  gender: z.enum(["male", "female", "other"]),
})

export function BMIForm() {
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<PersonalizedFitnessPlanOutput | null>(null)
  const [bmiResult, setBmiResult] = useState<{ score: number; classification: string; goal: string } | null>(null)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const heightInMeters = values.height / 100
      const score = parseFloat((values.weight / (heightInMeters * heightInMeters)).toFixed(1))
      
      let classification = ""
      let goal = ""
      
      if (score < 18.5) {
        classification = "Underweight"
        goal = "Weight Gain"
      } else if (score >= 18.5 && score < 24.9) {
        classification = "Normal Weight"
        goal = "Maintenance & Toning"
      } else if (score >= 25 && score < 29.9) {
        classification = "Overweight"
        goal = "Weight Loss"
      } else {
        classification = "Obese"
        goal = "Weight Loss"
      }

      setBmiResult({ score, classification, goal })

      const generatedPlan = await generatePersonalizedFitnessPlan({
        bmiClassification: classification,
        fitnessGoal: goal,
        heightCm: values.height,
        weightKg: values.weight,
        age: values.age,
        gender: values.gender,
      })
      
      setPlan(generatedPlan)
    } catch (error) {
      console.error("Failed to generate plan:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {!plan ? (
        <Card className="max-w-xl mx-auto border-primary/20 bg-card candy-red-glow">
          <CardHeader>
            <CardTitle className="text-3xl font-headline flex items-center gap-3">
              <Calculator className="text-primary w-8 h-8" />
              BMI Matrix
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="175" {...register("height")} className="bg-secondary/50 border-border" />
                  {errors.height && <p className="text-xs text-destructive">{errors.height.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="70" {...register("weight")} className="bg-secondary/50 border-border" />
                  {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="25" {...register("age")} className="bg-secondary/50 border-border" />
                  {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select onValueChange={(val) => setValue("gender", val as any)} defaultValue="male">
                    <SelectTrigger className="bg-secondary/50 border-border">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full h-12 font-bold text-lg candy-red-glow">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Calibrating AI Strategy...
                  </>
                ) : (
                  <>
                    Generate Bespoke Plan
                    <Target className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-secondary/30 rounded-xl border border-primary/20">
            <div className="text-center md:text-left">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Your Result</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-headline font-black text-primary">{bmiResult?.score}</span>
                <span className="text-lg font-medium text-white">{bmiResult?.classification}</span>
              </div>
            </div>
            <div className="h-px w-full md:h-12 md:w-px bg-border hidden md:block" />
            <div className="text-center md:text-left">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Recommended Goal</h2>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-accent w-6 h-6" />
                <span className="text-2xl font-headline font-bold text-accent">{bmiResult?.goal}</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => { setPlan(null); setBmiResult(null); }} className="border-muted-foreground/30">
              Recalculate
            </Button>
          </div>

          <FitnessPlanDisplay plan={plan} />
        </div>
      )}
    </div>
  )
}
