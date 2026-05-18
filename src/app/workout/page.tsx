
import { Navigation } from "@/components/navigation"
import { WorkoutTracker } from "@/components/workout-tracker"

export default function WorkoutPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 md:pt-24 px-4 md:px-8">
      <Navigation />
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-black mb-4 uppercase text-white tracking-tighter">
          Training <span className="text-primary italic">Sessions</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Resilient, offline-first rep counting. Your progress is cached 
          locally and synchronized automatically when industrial connection returns.
        </p>
      </div>
      <WorkoutTracker />
    </div>
  )
}
