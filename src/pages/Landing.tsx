import { Link } from 'react-router-dom'
import { Button } from '@/components/shadcn/button'
import { DeltaHero } from '@/components/landing/DeltaHero'
import { AboutSection } from '@/components/landing/AboutSection'

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#0F2A44] flex flex-col">
            {/* Login Button Overlay */}
            <div className="absolute top-6 right-6 z-50">
                <Link to="/login">
                    <Button
                        className="bg-[#7C94B8] text-white hover:bg-[#D9D9D8] hover:text-[#7C94B8] px-6 font-medium tracking-wide shadow-lg border-2 border-transparent hover:border-[#7C94B8]/50 transition-all"
                    >
                        Log in
                    </Button>
                </Link>
            </div>

            <main className="flex-grow">
                <DeltaHero />
                <AboutSection />
            </main>

            {/* Copyright Footer */}
            <footer className="py-6 bg-[#0F2A44] border-t border-[#7C94B8]/20 z-10 relative">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-xs text-[#7C94B8]/60">
                        &copy; 2025 Delta. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
