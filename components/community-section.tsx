"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Twitter, MessageCircle, Users, TrendingUp } from "lucide-react"

export function CommunitySection() {
  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "15.2K", label: "Discord Members" },
    { icon: <Twitter className="h-6 w-6" />, value: "28.5K", label: "Twitter Followers" },
    { icon: <MessageCircle className="h-6 w-6" />, value: "1.2M", label: "Messages Daily" },
    { icon: <TrendingUp className="h-6 w-6" />, value: "95%", label: "Active Holders" },
  ]

  const testimonials = [
    {
      name: "CryptoKing",
      avatar: "/cyberpunk-avatar-profile.jpg",
      text: "CloneX changed my perspective on digital identity. The community is incredible!",
    },
    {
      name: "MetaQueen",
      avatar: "/futuristic-female-avatar.jpg",
      text: "Best investment I've made in the NFT space. The utility keeps growing!",
    },
    {
      name: "TechNinja",
      avatar: "/tech-ninja-cyberpunk-avatar.jpg",
      text: "From gaming to virtual events, my CloneX is my passport to the metaverse.",
    },
  ]

  return (
    <section
      id="community"
      className="py-24 relative bg-gradient-to-br from-accent/5 via-background/90 to-primary/10 backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/futuristic-cyberpunk-avatar-with-neon-glow.jpg"
          alt=""
          className="absolute top-12 left-8 w-24 h-24 object-cover rounded-full opacity-14 animate-pulse red-glow"
        />
        <img
          src="/cyberpunk-avatar-profile.jpg"
          alt=""
          className="absolute top-28 right-12 w-30 h-30 object-cover rounded-full opacity-10 animate-bounce gold-glow"
        />
        <img
          src="/futuristic-female-avatar.jpg"
          alt=""
          className="absolute bottom-24 left-16 w-28 h-28 object-cover rounded-full opacity-12 animate-pulse blue-glow"
        />
        <img
          src="/tech-ninja-cyberpunk-avatar.jpg"
          alt=""
          className="absolute bottom-12 right-20 w-32 h-32 object-cover rounded-full opacity-8 animate-bounce red-glow"
        />
        <img
          src="/futuristic-cyberpunk-avatar-clone-.jpg"
          alt=""
          className="absolute top-1/2 left-4 w-22 h-22 object-cover rounded-full opacity-16 animate-pulse gold-glow"
        />
        <img
          src="/cyberpunk-avatar-profile.jpg"
          alt=""
          className="absolute top-2/3 right-6 w-26 h-26 object-cover rounded-full opacity-11 animate-bounce blue-glow"
        />
        <img
          src="/futuristic-female-avatar.jpg"
          alt=""
          className="absolute top-1/4 left-1/2 w-20 h-20 object-cover rounded-full opacity-13 animate-pulse red-glow"
        />
        <img
          src="/tech-ninja-cyberpunk-avatar.jpg"
          alt=""
          className="absolute bottom-1/3 right-1/2 w-24 h-24 object-cover rounded-full opacity-9 animate-bounce gold-glow"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 neon-text">
            Join the <span className="text-accent">Revolution</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Be part of the most active and innovative NFT community in the metaverse.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3 text-accent">{stat.icon}</div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border hover:border-accent/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3 gold-glow"
                  />
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                </div>
                <p className="text-muted-foreground italic text-pretty">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            <Twitter className="mr-2 h-5 w-5" />
            Follow on Twitter
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Join Discord
          </Button>
        </div>
      </div>
    </section>
  )
}
