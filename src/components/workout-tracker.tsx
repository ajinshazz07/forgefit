
"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Pause, RotateCcw, Save, CloudOff, Cloud, Dumbbell, History as HistoryIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface WorkoutLog {
  id: string
  exercise: string
  reps: number
  timestamp: number
  synced: boolean
}

export function WorkoutTracker() {
  const [exercise, setExercise] = useState("Pushups")
  const [reps, setReps] = useState(0)
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [isOnline, setIsOnline] = useState(true)

  // Load from local storage (Hive equivalent)
  useEffect(() => {
    const savedLogs = localStorage.getItem('forgefit_workouts')
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs))
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Sync logic simulation
  useEffect(() => {
    if (isOnline) {
      const unsynced = logs.filter(l => !l.synced)
      if (unsynced.length > 0) {
        setTimeout(() => {
          const syncedLogs = logs.map(l => ({ ...l, synced: true }))
          setLogs(syncedLogs)
          localStorage.setItem('forgefit_workouts', JSON.stringify(syncedLogs))
          toast({
            title: "Success",
            description: `${unsynced.length} workouts synced to the cloud.`
          })
        }, 1500)
      }
    }
  }, [isOnline, logs])

  const saveWorkout = () => {
    if (reps === 0) return

    const newLog: WorkoutLog = {
      id: Math.random().toString(36).substr(2, 9),
      exercise,
      reps,
      timestamp: Date.now(),
      synced: isOnline
    }

    const updatedLogs = [newLog, ...logs]
    setLogs(updatedLogs)
    localStorage.setItem('forgefit_workouts', JSON.stringify(updatedLogs))
    setReps(0)
    
    toast({
      title: "Saved",
      description: `${exercise} session logged ${!isOnline ? '(stored locally)' : ''}`
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-card border-primary/20 overflow-hidden relative candy-red-glow">
          <div className="absolute top-4 right-4 z-10">
            {isOnline ? (
              <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10">
                <Cloud className="w-3 h-3 mr-1" /> Cloud Sync Active
              </Badge>
            ) : (
              <Badge variant="outline" className="border-yellow-500 text-yellow-500 bg-yellow-500/10">
                <CloudOff className="w-3 h-3 mr-1" /> Offline Mode
              </Badge>
            )}
          </div>
          
          <CardHeader className="bg-secondary/10 pt-10">
            <CardTitle className="text-4xl font-headline font-black uppercase text-center italic">
              Rep <span className="text-primary">Counter</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-full border-8 border-primary/30 flex items-center justify-center mb-8 relative">
              <span className="text-7xl font-black font-headline text-white drop-shadow-[0_0_15px_rgba(242,13,13,0.5)]">
                {reps}
              </span>
              <div className="absolute -bottom-2 bg-background border border-border px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Reps
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <Button size="icon" variant="outline" onClick={() => setReps(Math.max(0, reps - 1))} className="w-16 h-16 rounded-full border-border">
                <span className="text-2xl font-bold">-1</span>
              </Button>
              <Button size="icon" onClick={() => setReps(reps + 1)} className="w-24 h-24 rounded-full candy-red-glow-strong">
                <span className="text-4xl font-black">+1</span>
              </Button>
              <Button size="icon" variant="outline" onClick={() => setReps(0)} className="w-16 h-16 rounded-full border-border">
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>

            <div className="w-full max-w-xs mx-auto">
              <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg border border-border">
                {["Pushups", "Squats", "Burpees", "Lunge"].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setExercise(ex)}
                    className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all ${
                      exercise === ex ? "bg-primary text-white" : "text-muted-foreground hover:bg-white/5"
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-secondary/10 p-6 flex justify-center">
            <Button size="lg" className="px-12 font-black uppercase tracking-tighter italic h-14 text-xl" onClick={saveWorkout} disabled={reps === 0}>
              Save Session <Save className="ml-2 w-6 h-6" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="h-full bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <HistoryIcon className="text-primary w-6 h-6" />
              Ledger
            </CardTitle>
            <span className="text-xs text-muted-foreground">{logs.length} sessions</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="text-center py-12 opacity-30">
                  <Dumbbell className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-sm font-medium">No sessions logged yet.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-4 rounded-lg bg-secondary/20 border border-border flex items-center justify-between group hover:border-primary/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-headline font-bold text-lg italic uppercase">{log.exercise}</p>
                      <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-2xl font-black text-primary font-headline italic">{log.reps}</span>
                      {log.synced ? (
                        <Cloud className="w-3 h-3 text-green-500/50" />
                      ) : (
                        <CloudOff className="w-3 h-3 text-yellow-500/50" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
