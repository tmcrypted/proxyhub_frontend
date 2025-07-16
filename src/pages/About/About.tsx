import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { 
    Users, 
    Target, 
    Award, 
    Heart,
    Shield,
    Globe,
    Zap,
    ArrowRight
} from 'lucide-react'

const About = () => {
    const { t } = useTranslation()

    const team = [
        {
            name: 'Alex Johnson',
            role: 'CEO & Founder',
            bio: '10+ years in cybersecurity and proxy technologies',
            avatar: '👨‍💼'
        },
        {
            name: 'Sarah Chen',
            role: 'CTO',
            bio: 'Expert in network infrastructure and optimization',
            avatar: '👩‍💻'
        },
        {
            name: 'Mike Rodriguez',
            role: 'Head of Operations',
            bio: 'Specialist in global server deployment and maintenance',
            avatar: '👨‍🔧'
        },
        {
            name: 'Emily Watson',
            role: 'Customer Success',
            bio: 'Dedicated to ensuring customer satisfaction and support',
            avatar: '👩‍💬'
        }
    ]

    const values = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Security First',
            description: 'We prioritize the security and privacy of our customers above everything else'
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: 'Global Reach',
            description: 'Providing reliable proxy services across the globe with local expertise'
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'Performance',
            description: 'Optimized infrastructure for maximum speed and reliability'
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: 'Customer Focus',
            description: 'Your success is our success - we\'re here to help you grow'
        }
    ]

    const milestones = [
        { year: '2020', title: 'Company Founded', description: 'Started with a vision to democratize proxy access' },
        { year: '2021', title: 'First 1000 Customers', description: 'Reached our first major milestone' },
        { year: '2022', title: 'Global Expansion', description: 'Launched servers in 50+ countries' },
        { year: '2023', title: '10K+ Happy Customers', description: 'Continued growth and customer satisfaction' },
        { year: '2024', title: 'Industry Leader', description: 'Recognized as a top proxy service provider' }
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-black text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:20px_20px]"></div>
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span>ABOUT US • OUR MISSION • OUR TEAM</span>
                        </div>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
                        ABOUT
                        <span className="block text-4xl md:text-6xl font-light text-gray-400 mt-2">PROXY HUB</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto font-light">
                        We're on a mission to provide the world's most reliable, secure, and fast proxy solutions for businesses and individuals.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-5xl font-black mb-6 tracking-tighter">OUR MISSION</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 font-light leading-relaxed">
                                At Proxy Hub, we believe that everyone deserves access to secure, fast, and reliable internet connections. 
                                Whether you're a business looking to protect your data, a researcher gathering information, 
                                or an individual concerned about privacy, we're here to help.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 font-light leading-relaxed">
                                Our team of experts works tirelessly to maintain the highest standards of service quality, 
                                security, and customer support. We're not just a proxy provider – we're your trusted partner 
                                in navigating the digital world safely and efficiently.
                            </p>
                            <Link to="/buy">
                                <Button size="lg" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold px-8 py-3 rounded-xl border-2 border-black dark:border-white">
                                    GET STARTED TODAY
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-white rounded-xl p-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-4xl font-black text-black dark:text-white mb-2">50+</div>
                                    <div className="text-gray-600 dark:text-gray-400 font-light uppercase tracking-wider text-sm">Countries</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-black text-black dark:text-white mb-2">10K+</div>
                                    <div className="text-gray-600 dark:text-gray-400 font-light uppercase tracking-wider text-sm">Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-black text-black dark:text-white mb-2">99.9%</div>
                                    <div className="text-gray-600 dark:text-gray-400 font-light uppercase tracking-wider text-sm">Uptime</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-black text-black dark:text-white mb-2">24/7</div>
                                    <div className="text-gray-600 dark:text-gray-400 font-light uppercase tracking-wider text-sm">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-black text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4 tracking-tighter">OUR VALUES</h2>
                        <p className="text-xl text-gray-400 font-light">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <Card key={index} className="border-2 border-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-black">
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <div className="text-black">
                                            {value.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 tracking-wide">{value.title}</h3>
                                    <p className="text-gray-300 font-light leading-relaxed">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4 tracking-tighter">MEET OUR TEAM</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
                            The passionate people behind Proxy Hub
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <Card key={index} className="border-2 border-black dark:border-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-black">
                                <CardContent className="p-8 text-center">
                                    <div className="text-5xl mb-6">{member.avatar}</div>
                                    <h3 className="text-xl font-bold mb-2 tracking-wide">{member.name}</h3>
                                    <p className="text-black dark:text-white mb-4 font-bold uppercase tracking-wider">{member.role}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">{member.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 bg-black text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4 tracking-tighter">OUR JOURNEY</h2>
                        <p className="text-xl text-gray-400 font-light">
                            Key milestones in our company's growth
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-white"></div>
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-xl border-2 border-black absolute left-1/2 transform -translate-x-1/2`}></div>
                                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                        <div className="bg-white text-black rounded-xl p-6 border-2 border-white">
                                            <div className="text-3xl font-black mb-2">{milestone.year}</div>
                                            <h3 className="text-xl font-bold mb-2 tracking-wide">{milestone.title}</h3>
                                            <p className="text-gray-600 font-light leading-relaxed">{milestone.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white dark:bg-black border-t-2 border-black dark:border-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-black mb-4 tracking-tighter">JOIN OUR GROWING COMMUNITY</h2>
                    <p className="text-xl mb-8 text-gray-600 dark:text-gray-400 font-light">
                        Be part of thousands of satisfied customers who trust Proxy Hub for their proxy needs
                    </p>
                    <Link to="/buy">
                        <Button size="lg" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold px-8 py-3 rounded-xl border-2 border-black dark:border-white">
                            START USING PROXY HUB
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default About 