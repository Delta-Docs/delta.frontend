import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useAnimationFrame } from 'framer-motion'
import { RippleCanvas } from './RippleCanvas'
import { Button } from '@/components/shadcn/button'

export function DeltaHero() {
    const { scrollY } = useScroll()
    const yBg = useTransform(scrollY, [0, 500], [0, 200]) 

    const waveOffset = useMotionValue(0)
    const lastScroll = useRef(0)

    useAnimationFrame(() => {
        const current = scrollY.get()
        const delta = current - lastScroll.current

        // accumulate movement smoothly
        waveOffset.set(waveOffset.get() - delta * 0.2)

        lastScroll.current = current
    })

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-[var(--color-concerto)] overflow-hidden pb-30">

            {/* Background Animations */}
            <motion.div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ y: yBg }}
            >
                {/* solid particles (Equilateral Triangles) */}
                {[...Array(40)].map((_, i) => {
                    // Darker Palette for Light Background
                    const colors = ['#2A4D88', '#1E3A66', '#0F2A44', '#7C94B8']
                    return (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                backgroundColor: colors[i % colors.length],
                                width: Math.random() * 10 + 5 + 'px',
                                height: Math.random() * 10 + 5 + 'px',
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                clipPath: 'polygon(50% 0%, 0% 87%, 100% 87%)', // Equilateral Triangle approx
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                                y: [0, Math.random() * 100 - 50],
                                x: [0, Math.random() * 100 - 50],
                                rotate: [0, 360],
                                scale: [1, 1.2, 1],
                                opacity: [0, 0.4, 0.1] // Lower opacity for background
                            }}
                            transition={{
                                delay: 0.5,
                                duration: Math.random() * 10 + 15,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                        />
                    )
                })}
            </motion.div>

            {/* Container for the effect */}
            <div className="relative w-full max-w-5xl px-4 aspect-[3/1] flex items-center justify-center z-10">

                {/* SVG Layer for masking and stroke */}
                <svg
                    className="w-full h-full font-['Monaspace_Neon'] font-bold"
                    viewBox="0 0 800 200"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <clipPath id="delta-text-clip">
                            <text
                                x="50%"
                                y="50%"
                                dy=".35em"
                                textAnchor="middle"
                                fontSize="180"
                                letterSpacing="-0.02em"
                            >
                                Delta.
                            </text>
                        </clipPath>
                        {/* Reveal content from Right to Left (Logo Trail) */}
                        <mask id="reveal-mask">
                            <motion.rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill="white"
                                initial={{ x: "100%" }}
                                animate={{ x: "0%" }} 
                                transition={{
                                    duration: 4,
                                    ease: "easeInOut"
                                }}
                            />
                        </mask>
                    </defs>

                    {/* Water Background */}
                    <foreignObject
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        clipPath="url(#delta-text-clip)"
                        mask="url(#reveal-mask)" // Apply Wipe Mask
                        style={{ overflow: 'visible' }} 
                    >
                        <div className="w-full h-full bg-[#D9D9D8]">
                            <RippleCanvas className="w-full h-full" />
                        </div>
                    </foreignObject>

                    {/* Text Stroke to appear with water */}
                    <motion.text
                        x="50%"
                        y="50%"
                        dy=".35em"
                        textAnchor="middle"
                        fontSize="180"
                        letterSpacing="-0.02em"
                        fill="transparent"
                        stroke="#2A4D88" 
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        mask="url(#reveal-mask)" // Apply Wipe Mask
                        initial={{ opacity: 1 }} 
                        animate={{ opacity: 1 }}
                    >
                        Delta.
                    </motion.text>
                </svg>

                {/* Logo Animation Layer */}
                <motion.div
                    className="absolute top-1/2 left-0 w-full flex items-center pointer-events-none"
                    initial={{ opacity: 0, x: "90%" }}
                    animate={{
                        opacity: [0, 1, 1, 0], 
                        x: ["90%", "-10%"] 
                    }}
                    transition={{
                        duration: 4,
                        times: [0, 0.15, 0.85, 1],
                        ease: "easeInOut"
                    }}
                    style={{
                        height: '240px', 
                        marginTop: '-120px'
                    }}
                >
                    {/* Logo Image */}
                    <div className="relative w-70 h-70 flex items-center justify-center -ml-32"> {/* Center on x-coordinate */}
                        <img
                            src="/Delta Docs Logo.png"
                            alt="Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </motion.div>

            </div>

            {/* Tagline */}
            <motion.div
                className="flex flex-col items-center mt-4 md:-mt-10 space-y-7 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.2, duration: 0.8 }}
            >
                <h2 className="text-[#2A4D88] text-xl md:text-2xl font-medium text-center">
                    Reflecting every change, preserving every insight.
                </h2>

                <Button
                    size="lg"
                    className="bg-[#0F2A44] hover:bg-[#2A4D88] text-white px-8 py-6 text-lg rounded-md"
                >
                    Explore more
                </Button>
            </motion.div>

            {/* Section Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
                <motion.svg
                    className="relative block w-[400%] h-[100px] md:h-[150px]"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    style={{ x: waveOffset }}
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        fill="#2A4D88"
                        transform="scale(10, -1) translate(0, -120)"
                    ></path>
                </motion.svg>
            </div>

        </div>
    )
}
