import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  Camera,
  ClipboardCheck,
  Clock,
  Shield,
  UserCheck,
  Star,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <section className="responsive-padding relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/20 via-background to-background"></div>
          <div className="responsive-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-sm text-gold-500 w-fit mx-auto lg:mx-0">
                  <span className="font-medium">Premium Camera Rental System</span>
                </div>
                <div className="space-y-2">
                  <h1 className="responsive-heading font-bold tracking-tighter">
                    Streamline Your <span className="text-gold-400">Camera Rental</span> Business
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                    Manage reservations, generate contracts, and verify customers - all in one place. Perfect for camera
                    rental shops in the Philippines.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full gold-gradient hover:opacity-90 transition-opacity"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="#demo" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-gold-500/30 hover:border-gold-500/80 hover:bg-gold-500/10"
                    >
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mt-8 lg:mt-0">
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 opacity-30 blur-xl"></div>
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Camera rental dashboard preview"
                  className="relative rounded-lg object-cover border border-gold-500/20 shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-secondary py-12 md:py-24 lg:py-32 border-y border-gold-700/20">
          <div className="responsive-container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-sm text-gold-500">
                <span className="font-medium">Premium Features</span>
              </div>
              <div className="space-y-2">
                <h2 className="responsive-heading font-bold tracking-tighter">
                  Powerful <span className="text-gold-400">Features</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground responsive-body">
                  Everything you need to run your camera rental business efficiently
                </p>
              </div>
            </div>
            <div className="responsive-container mt-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="flex flex-col items-center space-y-2 rounded-lg border border-gold-700/30 p-6 shadow-lg hover:shadow-gold-500/10 transition-all duration-300 group">
                  <div className="rounded-full bg-gold-500/10 p-3 group-hover:bg-gold-500/20 transition-colors duration-300">
                    <CalendarDays className="h-10 w-10 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold">Smart Scheduling</h3>
                  <p className="text-center text-muted-foreground">
                    Automatically check availability and prevent double bookings
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border border-gold-700/30 p-6 shadow-lg hover:shadow-gold-500/10 transition-all duration-300 group">
                  <div className="rounded-full bg-gold-500/10 p-3 group-hover:bg-gold-500/20 transition-colors duration-300">
                    <ClipboardCheck className="h-10 w-10 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold">Auto Contracts</h3>
                  <p className="text-center text-muted-foreground">
                    Generate professional rental agreements with just a few clicks
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border border-gold-700/30 p-6 shadow-lg hover:shadow-gold-500/10 transition-all duration-300 group">
                  <div className="rounded-full bg-gold-500/10 p-3 group-hover:bg-gold-500/20 transition-colors duration-300">
                    <UserCheck className="h-10 w-10 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold">ID Verification</h3>
                  <p className="text-center text-muted-foreground">Securely collect and store customer identification</p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border border-gold-700/30 p-6 shadow-lg hover:shadow-gold-500/10 transition-all duration-300 group">
                  <div className="rounded-full bg-gold-500/10 p-3 group-hover:bg-gold-500/20 transition-colors duration-300">
                    <Shield className="h-10 w-10 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold">Digital Signatures</h3>
                  <p className="text-center text-muted-foreground">
                    Legally binding electronic signatures for all contracts
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border border-gold-700/30 p-6 shadow-lg hover:shadow-gold-500/10 transition-all duration-300 group">
                  <div className="rounded-full bg-gold-500/10 p-3 group-hover:bg-gold-500/20 transition-colors duration-300">
                    <Clock className="h-10 w-10 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold">Flexible Scheduling</h3>
                  <p className="text-center text-muted-foreground">
                    Allow admins to modify bookings and handle change requests
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border border-gold-700/30 p-6 shadow-lg hover:shadow-gold-500/10 transition-all duration-300 group">
                  <div className="rounded-full bg-gold-500/10 p-3 group-hover:bg-gold-500/20 transition-colors duration-300">
                    <Camera className="h-10 w-10 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold">Equipment Management</h3>
                  <p className="text-center text-muted-foreground">Track your inventory and maintenance schedules</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-12 md:py-24 lg:py-32">
          <div className="responsive-container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-sm text-gold-500">
                <span className="font-medium">Simple Process</span>
              </div>
              <div className="space-y-2">
                <h2 className="responsive-heading font-bold tracking-tighter">
                  How It <span className="text-gold-400">Works</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground responsive-body">
                  Simple process for both rental shop owners and customers
                </p>
              </div>
            </div>
            <div className="responsive-container">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    step: 1,
                    title: "Customer Books Equipment",
                    description: "Customers select equipment and preferred rental dates",
                  },
                  {
                    step: 2,
                    title: "System Checks Availability",
                    description: "Automatic verification ensures no scheduling conflicts",
                  },
                  {
                    step: 3,
                    title: "Contract Generation",
                    description: "Digital contract is created with customer details and rental terms",
                  },
                  {
                    step: 4,
                    title: "ID Verification",
                    description: "Customer uploads ID for verification and security",
                  },
                  {
                    step: 5,
                    title: "Digital Signature",
                    description: "Customer signs the contract electronically",
                  },
                  {
                    step: 6,
                    title: "Rental Confirmed",
                    description: "Both parties receive confirmation and rental details",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center space-y-4 group">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/20 text-gold-400 text-2xl font-bold group-hover:bg-gold-500 group-hover:text-black transition-colors duration-300">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-gold-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-center text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-secondary py-12 md:py-24 lg:py-32 border-y border-gold-700/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/10 via-transparent to-transparent"></div>
          <div className="responsive-container relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-sm text-gold-500">
                <span className="font-medium">Client Success Stories</span>
              </div>
              <div className="space-y-2">
                <h2 className="responsive-heading font-bold tracking-tighter">
                  What Our <span className="text-gold-400">Clients Say</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground responsive-body">
                  Hear from rental shop owners who transformed their business with Rent n&apos; Snap
                </p>
              </div>
            </div>

            <div className="responsive-container">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
                {[
                  {
                    name: "Maria Santos",
                    role: "Owner, PixelPerfect Rentals",
                    image: "/placeholder.svg?height=100&width=100&text=MS",
                    quote:
                      "Since implementing Rent n' Snap, our booking errors have decreased by 95%. The digital contracts and ID verification have saved us countless hours of paperwork.",
                    rating: 5,
                  },
                  {
                    name: "Juan Reyes",
                    role: "Manager, Manila Camera Hub",
                    image: "/placeholder.svg?height=100&width=100&text=JR",
                    quote:
                      "The scheduling system is flawless. We can now manage multiple locations from a single dashboard, and our customers love the professional experience.",
                    rating: 5,
                  },
                  {
                    name: "Sofia Cruz",
                    role: "Owner, LensMasters Philippines",
                    image: "/placeholder.svg?height=100&width=100&text=SC",
                    quote:
                      "Rent n' Snap has completely transformed how we manage our premium equipment. The gold-standard security features give us peace of mind with high-value rentals.",
                    rating: 5,
                  },
                  {
                    name: "Miguel Lim",
                    role: "Director, Cebu Film Equipment",
                    image: "/placeholder.svg?height=100&width=100&text=ML",
                    quote:
                      "Our revenue increased by 30% in the first quarter after switching to Rent n' Snap. The system's efficiency allowed us to handle more rentals with the same staff.",
                    rating: 4,
                  },
                  {
                    name: "Isabella Garcia",
                    role: "Owner, Davao Camera Co.",
                    image: "/placeholder.svg?height=100&width=100&text=IG",
                    quote:
                      "The customer experience is seamless from booking to return. Our clients specifically mention how professional our process has become.",
                    rating: 5,
                  },
                  {
                    name: "Rafael Tan",
                    role: "Manager, ProCam Rentals",
                    image: "/placeholder.svg?height=100&width=100&text=RT",
                    quote:
                      "The analytics dashboard helps us make informed decisions about inventory. We've optimized our equipment selection based on the data and increased profitability.",
                    rating: 5,
                  },
                ].map((testimonial, i) => (
                  <div
                    key={i}
                    className="flex flex-col rounded-lg border border-gold-700/30 bg-background/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-gold-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 opacity-50 blur"></div>
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          width={60}
                          height={60}
                          alt={testimonial.name}
                          className="relative rounded-full border border-gold-500/20"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">{testimonial.name}</h3>
                        <p className="text-sm text-gold-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-5 w-5 ${
                            starIndex < testimonial.rating ? "text-gold-400 fill-gold-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="flex-1 text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center space-y-8">
              <h3 className="text-2xl font-bold">Trusted by Leading Rental Businesses</h3>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-70">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="group">
                    <Image
                      src={`/placeholder.svg?height=40&width=120&text=PARTNER+${i}`}
                      width={120}
                      height={40}
                      alt={`Partner ${i}`}
                      className="grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-12 md:py-24 lg:py-32">
          <div className="responsive-container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-sm text-gold-500">
                <span className="font-medium">Flexible Plans</span>
              </div>
              <div className="space-y-2">
                <h2 className="responsive-heading font-bold tracking-tighter">
                  Pricing <span className="text-gold-400">Plans</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground responsive-body">
                  Choose the plan that fits your business needs
                </p>
              </div>
            </div>
            <div className="responsive-container">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="flex flex-col rounded-lg border border-gold-700/30 bg-background p-6 shadow-lg hover:shadow-gold-500/10 transition-all duration-300 relative overflow-hidden">
                  <div className="flex flex-col items-center space-y-2 pb-6 relative z-10">
                    <h3 className="text-2xl font-bold">Starter</h3>
                    <p className="text-center text-muted-foreground">For small rental shops</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold">₱999</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 pb-6 relative z-10">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Up to 50 equipment items
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Basic scheduling
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Digital contracts
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Email support
                    </li>
                  </ul>
                  <div className="mt-auto relative z-10">
                    <Button className="w-full gold-gradient hover:opacity-90 transition-opacity">Get Started</Button>
                  </div>
                </div>
                <div className="flex flex-col rounded-lg border border-gold-500/50 bg-background p-6 shadow-lg gold-glow relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gold-500 text-black font-medium py-1 px-4 text-sm">
                    Popular
                  </div>
                  <div className="flex flex-col items-center space-y-2 pb-6 relative z-10">
                    <h3 className="text-2xl font-bold">Professional</h3>
                    <p className="text-center text-muted-foreground">For growing businesses</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gold-400">₱1,999</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 pb-6 relative z-10">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Up to 200 equipment items
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Advanced scheduling
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Custom contracts
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Analytics dashboard
                    </li>
                  </ul>
                  <div className="mt-auto relative z-10">
                    <Button className="w-full gold-gradient hover:opacity-90 transition-opacity animate-pulse-gold">
                      Get Started
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col rounded-lg border border-gold-700/30 bg-background p-6 shadow-lg hover:shadow-gold-500/10 transition-all duration-300 relative overflow-hidden">
                  <div className="flex flex-col items-center space-y-2 pb-6 relative z-10">
                    <h3 className="text-2xl font-bold">Enterprise</h3>
                    <p className="text-center text-muted-foreground">For large operations</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold">₱3,999</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 pb-6 relative z-10">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Unlimited equipment items
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Multi-location support
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Advanced reporting
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Dedicated account manager
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      API access
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-gold-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      White labeling options
                    </li>
                  </ul>
                  <div className="mt-auto relative z-10">
                    <Button className="w-full gold-gradient hover:opacity-90 transition-opacity">Contact Sales</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary border-t border-gold-700/20">
        <div className="responsive-container py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-gold-400" />
                <span className="text-xl font-bold">
                  Rent n&apos; <span className="text-gold-400">Snap</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Streamline your camera rental business with our powerful platform.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-gold-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-gold-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-gold-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@rentnsnap.com" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                    support@rentnsnap.com
                  </a>
                </li>
                <li>
                  <a href="tel:+1234567890" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="text-sm text-muted-foreground">
                  123 Camera Street<br />
                  Photography City, PC 12345
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                © {new Date().getFullYear()} Rent n&apos; Snap. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-gold-400 transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


