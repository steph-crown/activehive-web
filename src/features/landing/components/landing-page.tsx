import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from "@/components/icons/logo";
import {
  IconBarbell,
  IconUsers,
  IconCalendar,
  IconChartBar,
  IconMapPin,
  IconShield,
  IconChevronRight,
} from "@tabler/icons-react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import gymHeroImage from "@/assets/gym-assets/gym-1-min.jpg";
import dashboardImage from "@/assets/dashboard.png";

const features = [
  {
    icon: IconUsers,
    title: "Member Management",
    description:
      "Efficiently manage your gym members with comprehensive profiles, membership tracking, and automated communications.",
  },
  {
    icon: IconCalendar,
    title: "Class Scheduling",
    description:
      "Create and manage fitness classes with trainer assignments, capacity tracking, and automated scheduling.",
  },
  {
    icon: IconChartBar,
    title: "Analytics & Reports",
    description:
      "Get insights into your gym's performance with detailed analytics, revenue reports, and member statistics.",
  },
  {
    icon: IconMapPin,
    title: "Multi-Location Support",
    description:
      "Manage multiple gym locations from a single dashboard with location-specific settings and reporting.",
  },
  {
    icon: IconBarbell,
    title: "Facility Management",
    description:
      "Track and manage your gym facilities, equipment, and amenities across all locations.",
  },
  {
    icon: IconShield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with data encryption, role-based access control, and regular backups.",
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

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    period: "per month",
    description: "Perfect for small gyms getting started",
    features: [
      "Up to 100 members",
      "Single location",
      "Basic member management",
      "Class scheduling",
      "Email support",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "Ideal for growing fitness businesses",
    features: [
      "Up to 500 members",
      "Up to 3 locations",
      "Advanced analytics",
      "Staff management",
      "Priority support",
      "Custom integrations",
      "Automated reports",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large gym chains and franchises",
    features: [
      "Unlimited members",
      "Unlimited locations",
      "White-label options",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom development",
      "Advanced security",
      "API access",
    ],
    popular: false,
  },
];

const faqs = [
  {
    question: "How does the free trial work?",
    answer:
      "You can start with a 14-day free trial with full access to all features. No credit card required. Cancel anytime during the trial period with no charges.",
  },
  {
    question: "Can I manage multiple gym locations?",
    answer:
      "Yes! ActiveHive supports multiple locations. The Professional plan includes up to 3 locations, and the Enterprise plan offers unlimited locations with advanced multi-location management features.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express) and ACH transfers for Enterprise plans. All payments are processed securely through our encrypted payment gateway.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption, regular security audits, and comply with industry standards. Your data is backed up daily and stored in secure, redundant data centers.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period.",
  },
  {
    question: "Do you offer training for my staff?",
    answer:
      "Yes! We provide comprehensive onboarding, video tutorials, documentation, and live training sessions. Enterprise customers also receive dedicated training sessions with our team.",
  },
  {
    question: "Can I integrate with other software?",
    answer:
      "ActiveHive offers integrations with popular fitness apps, payment processors, and accounting software. Enterprise plans include custom integration development based on your specific needs.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "All plans include email support. Professional plans get priority support with faster response times. Enterprise customers receive 24/7 phone support and a dedicated account manager.",
  },
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
      <section className="relative overflow-hidden py-20 md:py-32 pb-32 md:pb-120">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={gymHeroImage}
            alt="Gym background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
                Manage Your Gym with
                <span className="text-primary"> ActiveHive</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 font-light">
                The all-in-one platform for gym owners to manage members,
                classes, staff, and locations. Streamline your operations and
                grow your fitness business.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/signup">
                    Start Free Trial
                    <IconChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:w-auto"
                  asChild
                >
                  <Link to="/login">Login to Dashboard</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Screenshot Section - Overlapping Hero */}
      <div className="relative">
        <section className="top-0 mb-20 absolute left-1/2 -translate-x-1/2 w-4/5 -translate-y-1/2">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-6xl"
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-background p-2 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <img
                  src={dashboardImage}
                  alt="ActiveHive Dashboard"
                  className="relative w-full rounded-lg object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-20 pt-120">
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
              Powerful features designed to help you manage every aspect of your
              fitness business.
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
                Join hundreds of gym owners who trust ActiveHive to power their
                fitness businesses.
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

      {/* Pricing Section */}
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
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your gym's needs. All plans include a
              14-day free trial.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full transition-shadow hover:shadow-lg ${
                    plan.popular
                      ? "border-primary shadow-lg ring-2 ring-primary/20"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period !== "pricing" && (
                        <span className="text-muted-foreground ml-2 text-sm">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-6 w-full"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      asChild
                    >
                      <Link to="/signup">
                        Get Started
                        <IconChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to know about ActiveHive.
              </p>
            </div>

            <div className="mt-12">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
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
              Join ActiveHive and experience the difference. Start your free
              trial now.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                asChild
              >
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
                  <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Support</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                  >
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
            <p>
              &copy; {new Date().getFullYear()} ActiveHive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
