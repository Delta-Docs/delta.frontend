import { DeltaHero } from '@/components/landing/DeltaHero'
import { AboutSection } from '@/components/landing/AboutSection'

export default function Landing() {
    return (
        <div className="min-h-screen">
            <DeltaHero />
            <AboutSection />
        </div>
    )
}
