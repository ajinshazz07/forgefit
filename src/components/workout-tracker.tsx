
"use client"

import { useState, useMemo } from "react"
import { Save, CloudOff, Cloud, Dumbbell, History as HistoryIcon, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, query, orderBy, limit, Firestore } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"

export function WorkoutTracker() {
  const { user, loading: userLoading } = useUser()
  const db = useFirestore()
  const [exercise, setExercise] = useState("Pushups")
  const [reps, setReps] = useState(0)
  const [saving, setSaving] = useState(false)

  const workoutsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "workouts"),
      orderBy("timestamp", "desc"),
      limit(20)
    );
  }, [db, user]);

  const { data: logs, loading: logsLoading } = useCollection(workoutsQuery);

  const saveWorkout = () => {
    if (!user || !db || reps === 0) {
      if (!user) toast({ title: "Authentication Required", description: "Sign in to record sessions.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const workoutData = {
      exercise,
      reps,
      timestamp: Date.now(),
      userId: user.uid
    };

    const workoutsRef = collection(db, "users", user.uid, "workouts");

    addDoc(workoutsRef, workoutData)
      .then(() => {
        setReps(0);
        setSaving(false);
        toast({
          title: "Session Recorded",
          description: `${exercise} logged to industrial ledger.`
        });
      })
      .catch(async (error) => {
        setSaving(false);
        const permissionError = new FirestorePermissionError({
          path: workoutsRef.path,
          operation: 'create',
          requestResourceData: workoutData,
        } satisfies SecurityRuleContext);

        errorEmitter.emit('permission-error', permissionError);
      });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-card border-primary/20 overflow-hidden relative candy-red-glow">
          <div className="absolute top-4 right-4 z-10">
            {user ? (
              <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10">
                <Cloud className="w-3 h-3 mr-1" /> Cloud Sync Active
              </Badge>
            ) : (
              <Badge variant="outline" className="border-yellow-500 text-yellow-500 bg-yellow-500/10">
                <CloudOff className="w-3 h-3 mr-1" /> Offline - Login Required
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
            <Button 
              size="lg" 
              className="px-12 font-black uppercase tracking-tighter italic h-14 text-xl" 
              onClick={saveWorkout} 
              disabled={reps === 0 || saving || !user}
            >
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Save Session <Save className="ml-2 w-6 h-6" /></>}
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
            <span className="text-xs text-muted-foreground">{logs?.length || 0} sessions</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {logsLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                </div>
              ) : !logs || logs.length === 0 ? (
                <div className="text-center py-12 opacity-30">
                  <Dumbbell className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-sm font-medium">No sessions logged yet.</p>
                </div>
              ) : (
                logs.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-lg bg-secondary/20 border border-border flex items-center justify-between group hover:border-primary/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-headline font-bold text-lg italic uppercase">{log.exercise}</p>
                      <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-2xl font-black text-primary font-headline italic">{log.reps}</span>
                      <Cloud className="w-3 h-3 text-green-500/50" />
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
