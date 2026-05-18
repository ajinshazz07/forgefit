
import { Navigation } from "@/components/navigation"
import { ShopGrid } from "@/components/shop-grid"

export default function ShopPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 md:pt-24 px-4 md:px-8">
      <Navigation />
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-black mb-4 uppercase text-white tracking-tighter">
          The <span className="text-primary italic">Vault</span> Gear Shop
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Industrial-grade hardware and elite supplements. Hand-picked for 
          those who demand the most from their physical legacy.
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <ShopGrid />
      </div>
    </div>
  )
}
