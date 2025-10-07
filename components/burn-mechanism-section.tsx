"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Flame, TrendingDown, Coins, ArrowRight } from "lucide-react"

export function BurnMechanismSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const burnStats = [
    { label: "Total Burned", value: "2.5M CLXSTR", percentage: 12.5 },
    { label: "Burn Rate", value: "50K/day", trend: "+15%" },
    { label: "Supply Remaining", value: "17.5M CLXSTR", percentage: 87.5 },
  ]

  const mechanisms = [
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Buy CloneX",
      description: "Every CloneX purchase burns 5% of CLXSTR from total supply",
      burnRate: "5%",
      color: "from-red-500/20 to-orange-500/20",
    },
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: "Sell CloneX",
      description: "CloneX sales trigger 3% token burn, reducing circulating supply",
      burnRate: "3%",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "Trading Fees",
      description: "All platform fees automatically burned, creating deflationary pressure",
      burnRate: "2%",
      color: "from-yellow-500/20 to-red-500/20",
    },
  ]

  return (
    <section id="burn-mechanism" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/futuristic-cyberpunk-avatar-with-neon-glow.jpg"
          alt=""
          className="absolute top-20 left-16 w-32 h-32 object-cover rounded-full opacity-10 animate-pulse red-glow"
        />
        <img
          src="/cyberpunk-avatar-profile.jpg"
          alt=""
          className="absolute top-32 right-20 w-28 h-28 object-cover rounded-full opacity-8 animate-bounce gold-glow"
        />
        <img
          src="/futuristic-female-avatar.jpg"
          alt=""
          className="absolute bottom-32 left-24 w-36 h-36 object-cover rounded-full opacity-12 animate-pulse blue-glow"
        />
        <img
          src="/tech-ninja-cyberpunk-avatar.jpg"
          alt=""
          className="absolute bottom-20 right-28 w-24 h-24 object-cover rounded-full opacity-15 animate-bounce red-glow"
        />
        <img
          src="/futuristic-cyberpunk-avatar-clone-.jpg"
          alt=""
          className="absolute top-1/2 left-8 w-22 h-22 object-cover rounded-full opacity-7 animate-pulse gold-glow"
        />
        <img
          src="/cyberpunk-avatar-profile.jpg"
          alt=""
          className="absolute top-1/3 right-12 w-30 h-30 object-cover rounded-full opacity-11 animate-bounce blue-glow"
        />
        <img
          src="/futuristic-female-avatar.jpg"
          alt=""
          className="absolute bottom-1/4 left-1/4 w-26 h-26 object-cover rounded-full opacity-9 animate-pulse red-glow"
        />
        <img
          src="/tech-ninja-cyberpunk-avatar.jpg"
          alt=""
          className="absolute top-3/4 right-1/3 w-20 h-20 object-cover rounded-full opacity-13 animate-bounce gold-glow"
        />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-6 py-2 mb-6">
            <Flame className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Deflationary Mechanism</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Burn Forever
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-balance">
            Every transaction permanently reduces CLXSTR supply through our revolutionary burn mechanism, creating
            scarcity and value for holders while powering the CloneX ecosystem.
          </p>
        </div>

        {/* Burn Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {burnStats.map((stat, index) => (
            <Card key={index} className="border-red-500/20 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{stat.value}</div>
                <div className="text-gray-400 mb-4">{stat.label}</div>
                {stat.percentage && <Progress value={stat.percentage} className="h-2 bg-gray-800" />}
                {stat.trend && <div className="text-green-400 text-sm mt-2">{stat.trend}</div>}
              </div>
            </Card>
          ))}
        </div>

        {/* Burn Mechanisms */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {mechanisms.map((mechanism, index) => (
            <Card
              key={index}
              className={`border-red-500/20 p-8 transition-all duration-300 cursor-pointer ${
                hoveredCard === index ? "scale-105 border-red-400/40" : ""
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-center">
                <div className="text-red-400 mb-4 flex justify-center">{mechanism.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{mechanism.title}</h3>
                <p className="text-gray-300 mb-6 text-balance">{mechanism.description}</p>
                <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-bold">{mechanism.burnRate} Burn</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Live Burn Tracker */}
        <Card className="border-red-500/20 p-8 mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Live Burn Tracker</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-red-400 mb-2">🔥</div>
                <div className="text-gray-400">Last Burn</div>
                <div className="text-white font-bold">2 mins ago</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">1,250</div>
                <div className="text-gray-400">CLXSTR Burned</div>
                <div className="text-green-400 text-sm">+5.2% today</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">CloneX #7891</div>
                <div className="text-gray-400">Trigger Transaction</div>
                <div className="text-blue-400 text-sm">Purchase</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400 mb-2">87.5%</div>
                <div className="text-gray-400">Supply Remaining</div>
                <div className="text-red-400 text-sm">Decreasing</div>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-bold group"
          >
            Start Burning CLXSTR
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-gray-400 mt-4">Join the deflationary revolution. Every action reduces supply forever.</p>
        </div>
      </div>
    </section>
  )
}
