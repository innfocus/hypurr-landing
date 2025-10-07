"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-r from-primary/10 via-background/95 to-accent/10 backdrop-blur-sm">
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/futuristic-cyberpunk-avatar-with-neon-glow.jpg"
          alt=""
          className="absolute top-16 left-10 w-28 h-28 object-cover rounded-full opacity-12 animate-pulse red-glow"
        />
        <img
          src="/cyberpunk-avatar-profile.jpg"
          alt=""
          className="absolute top-20 right-14 w-32 h-32 object-cover rounded-full opacity-8 animate-bounce gold-glow"
        />
        <img
          src="/futuristic-female-avatar.jpg"
          alt=""
          className="absolute bottom-20 left-18 w-24 h-24 object-cover rounded-full opacity-15 animate-pulse blue-glow"
        />
        <img
          src="/tech-ninja-cyberpunk-avatar.jpg"
          alt=""
          className="absolute bottom-16 right-22 w-36 h-36 object-cover rounded-full opacity-6 animate-bounce red-glow"
        />
        <img
          src="/futuristic-cyberpunk-avatar-clone-.jpg"
          alt=""
          className="absolute top-1/2 left-6 w-20 h-20 object-cover rounded-full opacity-18 animate-pulse gold-glow"
        />
        <img
          src="/cyberpunk-avatar-profile.jpg"
          alt=""
          className="absolute top-1/3 right-8 w-26 h-26 object-cover rounded-full opacity-10 animate-bounce blue-glow"
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 neon-text text-balance">
            Ready to Enter the <span className="text-primary">CloneX</span>?
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Don't miss your chance to own a piece of digital history. Join thousands of collectors in the CloneX
            universe today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <div className="flex items-center gap-3 text-accent">
              <Shield className="h-5 w-5" />
              <span>Secure & Verified</span>
            </div>
            <div className="flex items-center gap-3 text-accent">
              <Zap className="h-5 w-5" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-3 text-accent">
              <ArrowRight className="h-5 w-5" />
              <span>Metaverse Ready</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground red-glow text-lg px-8 py-4 group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground gold-glow text-lg px-8 py-4 bg-transparent"
            >
              Learn More
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            * Limited supply available. Prices may vary based on rarity and market conditions.
          </p>
        </div>
      </div>
    </section>
  )
}
