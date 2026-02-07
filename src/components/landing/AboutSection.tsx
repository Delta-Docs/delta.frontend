import { motion, useScroll, useTransform } from 'framer-motion'

export function AboutSection() {
    const { scrollYProgress } = useScroll()
    const yBg = useTransform(scrollYProgress, [0, 1], [0, -150])

    return (
        <section className="relative w-full pb-24 pt-12 md:pb-32 md:pt-20 bg-[#2A4D88] overflow-hidden text-[#D9D9D8]">
            {/* Background Texture - Light Particles */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: yBg }}
            >
                {/* solid particles */}
                {[...Array(30)].map((_, i) => {
                    const colors = ['#D9D9D8', '#B1BBC8', '#FFFFFF', '#A0A0A0'] // Light Palette
                    return (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                backgroundColor: colors[i % colors.length],
                                width: Math.random() * 8 + 4 + 'px',
                                height: Math.random() * 8 + 4 + 'px',
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                clipPath: 'polygon(50% 0%, 0% 87%, 100% 87%)',
                                opacity: 0.2
                            }}
                            animate={{
                                y: [0, -30, 0],
                                rotate: [0, 180],
                                opacity: [0.1, 0.3, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    )
                })}
            </motion.div>

            <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-100px", amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-['Monaspace_Neon'] leading-tight">
                        Eliminate <span className="text-[#B1BBC8]">Documentation Drift.</span>
                    </h2>

                    <div className="space-y-6 text-lg md:text-xl leading-relaxed text-[#B1BBC8]">
                        <p>
                            Delta connects directly to your CI/CD pipeline, ensuring your documentation evolves instantly with your codebase.
                        </p>
                        <p>
                            Automated drift detection, live architectural diagrams, and intelligent change summarization mean you never have to worry about stale wikis again.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#7C94B8]/20 flex items-center justify-center text-white text-xl">
                                🔄
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">CI/CD Sync</h3>
                                <p className="text-sm text-[#B1BBC8]">Updates with every commit.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#7C94B8]/20 flex items-center justify-center text-white text-xl">
                                ⚡
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Drift Detection</h3>
                                <p className="text-sm text-[#B1BBC8]">Always accurate.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Graphic Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px", amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="relative h-[400px] md:h-[500px] w-full rounded-2xl bg-gradient-to-br from-[#1E3A66] to-[#0F2A44] border border-[#7C94B8]/30 flex items-center justify-center overflow-hidden shadow-2xl"
                >
                    {/* Abstract */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-3/4 h-3/4 border border-[#7C94B8]/40 rounded-lg backdrop-blur-sm bg-white/5"
                                style={{
                                    transform: `rotate(${i * 15}deg) translate(${i * 20}px, ${i * -20}px)`,
                                    zIndex: 3 - i
                                }}
                                animate={{
                                    rotate: [i * 15, i * 15 + 5, i * 15],
                                    translateY: [0, -10, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    delay: i * 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                        <div className="z-10 w-48 h-48 opacity-20 invert"> {/* Logo Container */}
                            <img src="/Delta Docs Logo.png" alt="Delta Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
