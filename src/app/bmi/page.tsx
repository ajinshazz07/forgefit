
import { Navigation } from "@/components/navigation"
import { BMIForm } from "@/components/bmi-form"

export default function BMIPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 md:pt-24 px-4 md:px-8">
      <Navigation />
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-black mb-4 uppercase text-white tracking-tighter">
          Health <span className="text-primary italic">Metrics</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Input your vital statistics to generate a precision-engineered nutrition 
          and training program powered by our elite GenAI model.
        </p>
      </div>
      <BMIForm />
    </div>
  )
}
