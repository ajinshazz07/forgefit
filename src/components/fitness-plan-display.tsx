
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PersonalizedFitnessPlanOutput } from "@/ai/flows/personalized-fitness-plan-generation"
import { Utensils, Activity, CalendarDays, Clock, Flame, ChevronRight } from "lucide-react"

export function FitnessPlanDisplay({ plan }: { plan: PersonalizedFitnessPlanOutput }) {
  return (
    <div className="max-w-6xl mx-auto">
      <Tabs defaultValue="diet" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12 bg-secondary/50 mb-8">
          <TabsTrigger value="diet" className="text-lg font-headline data-[state=active]:bg-primary">
            <Utensils className="mr-2 w-5 h-5" /> Diet
          </TabsTrigger>
          <TabsTrigger value="workout" className="text-lg font-headline data-[state=active]:bg-primary">
            <Activity className="mr-2 w-5 h-5" /> Workout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diet" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plan.dietPlan.map((meal, idx) => (
              <Card key={idx} className="bg-card border-border hover:border-primary/50 transition-all overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-secondary/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-headline italic">{meal.time}</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-accent text-accent">
                    <Flame className="w-3 h-3 mr-1" /> {meal.calories} kcal
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {meal.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground group/item">
                        <ChevronRight className="w-4 h-4 mt-1 text-primary group-hover/item:translate-x-1 transition-transform" />
                        <span className="text-foreground font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workout" className="space-y-6">
          <div className="grid grid-cols-1 gap-8">
            {plan.exerciseRoutine.map((routine, idx) => (
              <Card key={idx} className="bg-card border-border">
                <CardHeader className="border-b border-border bg-secondary/10 py-4 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="text-primary w-6 h-6" />
                      <CardTitle className="text-3xl font-headline font-black uppercase text-white">
                        {routine.day}
                      </CardTitle>
                    </div>
                    <Badge className="bg-primary hover:bg-primary font-bold">{routine.description}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {routine.exercises.map((ex, i) => (
                      <div key={i} className="p-6 hover:bg-secondary/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold text-foreground font-headline italic">{ex.name}</h4>
                          {ex.notes && <p className="text-sm text-muted-foreground">{ex.notes}</p>}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <span className="block text-2xl font-black text-primary font-headline">{ex.sets}</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Sets</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-2xl font-black text-accent font-headline">{ex.reps}</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Reps</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
