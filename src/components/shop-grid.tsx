
"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Plus, Package, Shield, Star, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { toast } from "@/hooks/use-toast"

const PRODUCTS = [
  {
    id: "p1",
    name: "Industrial Dumbbells",
    price: 129.99,
    image: PlaceHolderImages.find(i => i.id === 'dumbbells')?.imageUrl || "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=600",
    category: "Hardware",
    rating: 4.9
  },
  {
    id: "p2",
    name: "Resilience Bands",
    price: 49.99,
    image: PlaceHolderImages.find(i => i.id === 'resistance-bands')?.imageUrl || "https://images.unsplash.com/photo-1598289431512-b97b0917a63e?auto=format&fit=crop&q=80&w=600",
    category: "Hardware",
    rating: 4.7
  },
  {
    id: "p3",
    name: "Forge Whey Protein",
    price: 64.99,
    image: PlaceHolderImages.find(i => i.id === 'protein-powder')?.imageUrl || "https://images.unsplash.com/photo-1593095186572-4e6823c6f10d?auto=format&fit=crop&q=80&w=600",
    category: "Supplements",
    rating: 5.0
  },
  {
    id: "p4",
    name: "Castle Grip Mat",
    price: 39.99,
    image: PlaceHolderImages.find(i => i.id === 'yoga-mat')?.imageUrl || "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&q=80&w=600",
    category: "Gear",
    rating: 4.8
  }
]

export function ShopGrid() {
  const [cart, setCart] = useState<Record<string, number>>({})

  const addToCart = (id: string, name: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your vault.`
    })
  }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Badge className="bg-primary hover:bg-primary px-4 py-1 text-xs uppercase font-black italic tracking-widest">Elite Inventory</Badge>
          <Badge variant="outline" className="border-border text-muted-foreground hover:text-white transition-colors cursor-pointer">Hardware</Badge>
          <Badge variant="outline" className="border-border text-muted-foreground hover:text-white transition-colors cursor-pointer">Supplements</Badge>
        </div>
        
        <div className="relative group">
          <Button variant="outline" className="border-primary/50 gap-2 h-12 bg-secondary/20 hover:bg-secondary">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="font-bold">Vault Basket</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] font-black candy-red-glow text-white">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRODUCTS.map((product) => (
          <Card key={product.id} className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all candy-red-glow">
            <div className="relative aspect-square overflow-hidden bg-secondary">
              {product.image && product.image.trim() !== "" ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  data-ai-hint="gym equipment"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 text-muted-foreground">
                  <Package className="w-12 h-12 mb-2 opacity-20" />
                  <span className="text-[10px] uppercase font-black tracking-widest">Asset Pending</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="rounded-full w-10 h-10 shadow-lg bg-black/60 border border-white/10">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                </Button>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className="bg-black/60 backdrop-blur-md text-[10px] uppercase font-black border-white/10 italic tracking-widest">
                  {product.category}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-headline font-black italic uppercase tracking-tighter leading-none">{product.name}</h3>
                <span className="text-primary font-black font-headline text-lg italic leading-none">${product.price}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                <div className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-primary" /> Warranty</div>
                <div className="flex items-center gap-1.5"><Package className="w-3 h-3 text-primary" /> Priority</div>
              </div>
            </CardContent>
            
            <CardFooter className="p-6 pt-0">
              <Button 
                onClick={() => addToCart(product.id, product.name)}
                className="w-full h-12 font-black uppercase tracking-widest text-sm bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all italic"
              >
                Assemble Gear <Plus className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
