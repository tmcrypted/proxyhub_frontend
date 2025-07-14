import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
    Shield, 
    Zap, 
    Globe, 
    Users, 
    CheckCircle, 
    ArrowRight,
    Server,
    Lock,
    Clock,
    Star
} from 'lucide-react'

const Home = () => {
    const { t } = useTranslation()

    const features = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Secure & Anonymous',
            description: 'High-quality proxies with military-grade encryption for complete anonymity'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Lightning Fast',
            description: 'Optimized servers for maximum speed and minimal latency'
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: 'Global Coverage',
            description: 'Proxies from 50+ countries worldwide for geo-targeting'
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: '24/7 Support',
            description: 'Round-the-clock customer support to help you anytime'
        }
    ]

    const stats = [
        { number: '50+', label: 'Countries' },
        { number: '99.9%', label: 'Uptime' },
        { number: '10K+', label: 'Happy Clients' },
        { number: '<50ms', label: 'Average Latency' }
    ]

    const testimonials = [
        {
            name: 'John Smith',
            role: 'Digital Marketing',
            content: 'Best proxy service I\'ve ever used. Fast, reliable, and great support!',
            rating: 5
        },
        {
            name: 'Sarah Johnson',
            role: 'E-commerce',
            content: 'Perfect for our web scraping needs. Highly recommended!',
            rating: 5
        },
        {
            name: 'Mike Davis',
            role: 'SEO Specialist',
            content: 'Excellent service quality and competitive pricing.',
            rating: 5
        }
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-black dark:bg-black text-white dark:text-white py-20 relative overflow-hidden">
                {/* Simple wavy line at top */}
                <div className="absolute top-0 left-0 w-full h-16 bg-background">
                    <svg className="w-full h-full" viewBox="0 0 1200 64" preserveAspectRatio="none">
                        <path d="M0,0 L0,64 L1200,64 L1200,0 C1000,0 1000,64 800,64 C600,64 600,0 400,0 C200,0 200,64 0,64 Z" fill="currentColor" className="text-black dark:text-black"/>
                    </svg>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span>SECURE • ANONYMOUS • FAST</span>
                        </div>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
                        WEB3
                        <span className="block text-4xl md:text-6xl font-light text-gray-400 mt-2">PROXY SHOP</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto font-light">
                        High-speed, secure, and anonymous proxies for all your needs.
                        <span className="block text-lg text-gray-500 mt-2">Trusted by thousands of businesses worldwide.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/buy">
                            <Button size="lg" className="bg-white dark:bg-white text-black dark:text-black hover:bg-gray-200 dark:hover:bg-gray-200 font-bold px-8 py-3 rounded-xl border-2 border-white dark:border-white">
                                GET STARTED
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button size="lg" variant="outline" className="border-2 border-white dark:border-white text-white dark:text-white hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black font-bold px-8 py-3 rounded-xl bg-transparent">
                                ABOUT
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            {/* <section className="py-20 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4 tracking-tighter">WHY CHOOSE OUR PROXIES?</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                            We provide the most reliable and secure proxy solutions for businesses and individuals
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-2 border-black dark:border-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-black">
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <div className="text-white dark:text-black">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 tracking-wide">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Stats Section */}
            <section className="py-20 bg-black dark:bg-black text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-5xl font-black mb-2 tracking-tighter">{stat.number}</div>
                                <div className="text-gray-400 font-light uppercase tracking-wider text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4 tracking-tighter text-black dark:text-white">HOW IT WORKS</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
                            Get started with our proxy service in just 3 simple steps
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center mx-auto mb-6 text-3xl font-black border-2 border-black dark:border-white">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-4 tracking-wide text-black dark:text-white">CHOOSE YOUR PLAN</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-light">
                                Select the proxy package that fits your needs and budget
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center mx-auto mb-6 text-3xl font-black border-2 border-black dark:border-white">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-4 tracking-wide text-black dark:text-white">GET YOUR PROXIES</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-light">
                                Receive your proxy credentials instantly after payment
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center mx-auto mb-6 text-3xl font-black border-2 border-black dark:border-white">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-4 tracking-wide text-black dark:text-white">START USING</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-light">
                                Configure your applications and start browsing securely
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-black dark:bg-black text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4 tracking-tighter">WHAT OUR CLIENTS SAY</h2>
                        <p className="text-xl text-gray-400 font-light">
                            Don't just take our word for it - hear from our satisfied customers
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border-2 border-white rounded-xl bg-black">
                                <CardContent className="p-8">
                                    <div className="flex mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-white fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-6 font-light leading-relaxed">
                                        "{testimonial.content}"
                                    </p>
                                    <div>
                                        <p className="font-bold tracking-wide">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500 uppercase tracking-wider">{testimonial.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white dark:bg-black border-t-2 border-black dark:border-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-black mb-4 tracking-tighter">READY TO GET STARTED?</h2>
                    <p className="text-xl mb-8 text-gray-600 dark:text-gray-400 font-light">
                        Join thousands of satisfied customers who trust our proxy service
                    </p>
                    <Link to="/buy">
                        <Button size="lg" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold px-8 py-3 rounded-xl border-2 border-black dark:border-white">
                            START YOUR FREE TRIAL
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Home 