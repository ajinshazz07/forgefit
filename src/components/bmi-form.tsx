"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calculator, Loader2, Target, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generatePersonalizedFitnessPlan, type PersonalizedFitnessPlanOutput } from "@/ai/flows/personalized-fitness-plan-generation"
import { FitnessPlanDisplay } from "./fitness-plan-display"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  height: z.coerce.number().min(50, "Height must be at least 50cm").max(300, "Height must be under 300cm"),
  weight: z.coerce.number().min(20, "Weight must be at least 20kg").max(500, "Weight must be under 500kg"),
  age: z.coerce.number().min(10, "Minimum age is 10").max(120, "Maximum age is 120"),
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
        goal = "Hypertrophic Focus (Gain)"
      } else if (score >= 18.5 && score < 24.9) {
        classification = "Optimal Weight"
        goal = "Performance & Definition"
      } else if (score >= 25 && score < 29.9) {
        classification = "Overweight"
        goal = "Metabolic Optimization"
      } else {
        classification = "Obese"
        goal = "Aggressive Fat Loss"
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
      toast({
        title: "Strategy Calculated",
        description: "Your industrial-grade fitness plan has been generated."
      })
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Failed to generate plan:", error)
      toast({
        variant: "destructive",
        title: "AI Matrix Failure",
        description: error.message || "Failed to reach GenAI model. Please verify API configuration."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {!plan ? (
        <Card className="max-w-xl mx-auto border-primary/20 bg-card candy-red-glow">
          <CardHeader>
            <CardTitle className="text-3xl font-headline flex items-center gap-3 italic">
              <Calculator className="text-primary w-8 h-8" />
              BMI <span className="text-primary">Matrix</span>
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="175" {...register("height")} className="bg-secondary/50 border-border h-12 font-bold" />
                  {errors.height && <p className="text-xs text-destructive flex items-center gap-1 mt-1 font-bold"><AlertCircle className="w-3 h-3" /> {errors.height.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="70" {...register("weight")} className="bg-secondary/50 border-border h-12 font-bold" />
                  {errors.weight && <p className="text-xs text-destructive flex items-center gap-1 mt-1 font-bold"><AlertCircle className="w-3 h-3" /> {errors.weight.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Age</Label>
                  <Input id="age" type="number" placeholder="25" {...register("age")} className="bg-secondary/50 border-border h-12 font-bold" />
                  {errors.age && <p className="text-xs text-destructive flex items-center gap-1 mt-1 font-bold"><AlertCircle className="w-3 h-3" /> {errors.age.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black tracking-widest text-muted-foreground">Gender</Label>
                  <Select onValueChange={(val) => setValue("gender", val as any)} defaultValue="male">
                    <SelectTrigger className="bg-secondary/50 border-border h-12 font-bold">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="font-bold">Male</SelectItem>
                      <SelectItem value="female" className="font-bold">Female</SelectItem>
                      <SelectItem value="other" className="font-bold">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full h-14 font-black text-xl candy-red-glow uppercase italic tracking-tighter">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Initializing Model...
                  </>
                ) : (
                  <>
                    Forge AI Strategy
                    <Target className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between p-8 bg-card rounded-xl border border-primary/20 backdrop-blur-sm candy-red-glow">
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2 italic">Athlete Classification</h2>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-headline font-black text-primary italic drop-shadow-[0_0_10px_rgba(242,13,13,0.4)]">{bmiResult?.score}</span>
                <span className="text-2xl font-headline font-bold text-white uppercase italic tracking-tighter">{bmiResult?.classification}</span>
              </div>
            </div>
            <div className="h-px w-full md:h-16 md:w-px bg-border/50 hidden md:block" />
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2 italic">Target Objective</h2>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <CheckCircle2 className="text-accent w-6 h-6" />
                </div>
                <span className="text-3xl font-headline font-black text-accent uppercase italic tracking-tighter">{bmiResult?.goal}</span>
              </div>
            </div>
            <Button variant="outline" size="lg" onClick={() => { setPlan(null); setBmiResult(null); }} className="border-primary/30 hover:bg-primary/10 transition-all h-14 font-black uppercase italic tracking-widest text-xs px-8">
              Recalibrate
            </Button>
          </div>

          <FitnessPlanDisplay plan={plan} />
        </div>
      )}
    </div>
  )
}
