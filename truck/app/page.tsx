// FreteConnect 2.0 - Landing Page
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}

