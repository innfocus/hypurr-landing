"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Cpu, Zap, Shield, Globe } from "lucide-react"

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const cards = sectionRef.current?.querySelectorAll(".feature-card")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: "8 DNA Types",
      description:
        "From Humans (50%) to rare Aliens (<0.15%), each CloneX has unique genetic traits and rarity levels.",
    },
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: "Murakami Drip",
      description: "15% of CloneX feature exclusive Takashi Murakami traits, making them coveted fine art pieces.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Nike Partnership",
      description: "Backed by Nike through RTFKT acquisition, with exclusive airdrops and Cryptokicks integration.",
    },
    {
      icon: <Globe className="h-8 w-8 text-accent" />,
      title: "Metaverse Ready",
      description: "3D avatars designed for virtual worlds, with Space Pods galleries and commercial licensing.",
    },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 relative bg-gradient-to-b from-primary/5 to-background/95 backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/futuristic-cyberpunk-avatar-with-neon-glow.jpg"
          alt=""
          className="absolute top-16 left-12 w-28 h-28 object-cover rounded-full opacity-12 animate-pulse red-glow"
        />
        <img
          src="/cyberpunk-avatar-profile.jpg"
          alt=""
          className="absolute top-24 right-16 w-32 h-32 object-cover rounded-full opacity-8 animate-bounce gold-glow"
        />
        <img
          src="/futuristic-female-avatar.jpg"
          alt=""
          className="absolute bottom-28 left-20 w-24 h-24 object-cover rounded-full opacity-15 animate-pulse blue-glow"
        />
        <img
          src="/tech-ninja-cyberpunk-avatar.jpg"
          alt=""
          className="absolute bottom-16 right-24 w-36 h-36 object-cover rounded-full opacity-6 animate-bounce red-glow"
        />
        <img
          src="/futuristic-cyberpunk-avatar-clone-.jpg"
          alt=""
          className="absolute top-1/2 left-6 w-20 h-20 object-cover rounded-full opacity-18 animate-pulse gold-glow"
        />
        <img
          src="/cyberpunk-avatar-profile.jpg"
          alt=""
          className="absolute top-2/3 right-8 w-26 h-26 object-cover rounded-full opacity-10 animate-bounce blue-glow"
        />
        <img
          src="/futuristic-female-avatar.jpg"
          alt=""
          className="absolute top-1/4 left-1/3 w-22 h-22 object-cover rounded-full opacity-14 animate-pulse red-glow"
        />
        <img
          src="/tech-ninja-cyberpunk-avatar.jpg"
          alt=""
          className="absolute bottom-1/3 right-1/4 w-30 h-30 object-cover rounded-full opacity-9 animate-bounce gold-glow"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 neon-text">
            The Future is <span className="text-accent">Now</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            CloneX represents the pinnacle of digital art and metaverse identity. Born from the legendary collaboration
            between RTFKT Studios and world-renowned artist Takashi Murakami, this collection of 20,000 unique 3D
            avatars bridges the gap between fine art and digital innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="feature-card border-border hover:border-primary/50 transition-all duration-300 hover:red-glow"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
