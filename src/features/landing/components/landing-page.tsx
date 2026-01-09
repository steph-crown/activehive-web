import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons/logo";
import {
  IconBarbell,
  IconUsers,
  IconCalendar,
  IconChartBar,
  IconMapPin,
  IconShield,
  IconChevronRight
} from "@tabler/icons-react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: IconUsers,
    title: "Member Management",
    description: "Efficiently manage your gym members with comprehensive profiles, membership tracking, and automated communications.",
  },
  {
    icon: IconCalendar,
    title: "Class Scheduling",
    description: "Create and manage fitness classes with trainer assignments, capacity tracking, and automated scheduling.",
  },
  {
    icon: IconChartBar,
    title: "Analytics & Reports",
    description: "Get insights into your gym's performance with detailed analytics, revenue reports, and member statistics.",
  },
  {
    icon: IconMapPin,
    title: "Multi-Location Support",
    description: "Manage multiple gym locations from a single dashboard with location-specific settings and reporting.",
  },
  {
    icon: IconBarbell,
    title: "Facility Management",
    description: "Track and manage your gym facilities, equipment, and amenities across all locations.",
  },
  {
    icon: IconShield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with data encryption, role-based access control, and regular backups.",
  },
];

const benefits = [
  "Streamline your gym operations",
  "Increase member retention",
  "Reduce administrative workload",
  "Gain valuable business insights",
  "Scale across multiple locations",
  "24/7 customer support",
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo path="/" />
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Manage Your Gym with
              <span className="text-primary"> ActiveHive</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              The all-in-one platform for gym owners to manage members, classes, staff, and locations.
              Streamline your operations and grow your fitness business.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <IconChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/login">Login to Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Run Your Gym
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to help you manage every aspect of your fitness business.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why Choose ActiveHive?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join hundreds of gym owners who trust ActiveHive to power their fitness businesses.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-base">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Ready to Get Started?</CardTitle>
                  <CardDescription>
                    Sign up today and start managing your gym more efficiently.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" className="w-full" asChild>
                    <Link to="/signup">
                      Create Free Account
                      <IconChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    No credit card required. Start your 14-day free trial.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Transform Your Gym Management Today
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Join ActiveHive and experience the difference. Start your free trial now.
            </p>
            <div className="mt-10">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                <Link to="/signup">
                  Get Started Free
                  <IconChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo path="/" />
              <p className="mt-4 text-sm text-muted-foreground">
                The all-in-one platform for gym management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Product</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Support</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="tel:+2349388338"
                    className="hover:text-foreground transition-colors"
                  >
                    +234 938 8338
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:mail@activehive.com"
                    className="hover:text-foreground transition-colors"
                  >
                    mail@activehive.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ActiveHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
