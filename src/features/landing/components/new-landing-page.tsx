import dashboardImage from "@/assets/dashboard.png";
import gymHeroImage from "@/assets/gym-assets/gym-1-min.jpg";
import gymSideImage from "@/assets/gym-assets/gym-3-min.jpg";
import { Logo } from "@/components/icons/logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  IconBarbell,
  IconBell,
  IconBrandAndroid,
  IconBrandApple,
  IconCalendar,
  IconChartBar,
  IconCheck,
  IconChevronRight,
  IconDeviceMobile,
  IconMapPin,
  IconQrcode,
  IconShield,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

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

const gymGoerFeatures = [
  {
    icon: IconDeviceMobile,
    label: "Book fitness classes instantly from your phone",
  },
  { icon: IconQrcode, label: "Scan QR code for seamless gym check-in" },
  { icon: IconBell, label: "Get smart reminders so you never miss a class" },
  { icon: IconBarbell, label: "Track your attendance and fitness progress" },
  { icon: IconStar, label: "View and renew your membership with ease" },
  { icon: IconUsers, label: "Connect with trainers and your gym community" },
];

const statsData = [
  { num: "500+", label: "Active Gyms" },
  { num: "50K+", label: "Members Onboarded" },
  { num: "₦1B+", label: "Payments Processed" },
  { num: "99.9%", label: "Platform Uptime" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₦49",
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
    price: "₦99",
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

export function NewLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* ── Nav ── */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#09090B]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Logo path="/" />
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Pricing
            </a>
            <a
              href="#app"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Mobile App
            </a>
            <a
              href="#faq"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden text-sm text-white/60 transition-colors hover:text-white md:block"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={gymHeroImage}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/60 via-[#09090B]/40 to-[#09090B]" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center md:px-8">
          {/* <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <IconBolt size={12} />
              Nigeria's #1 Gym Management Platform
            </span>
          </motion.div> */}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl leading-none text-white md:text-8xl"
          >
            POWER YOUR GYM. <span className="text-primary">GROW YOUR</span>
            <br />
            BUSINESS.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg font-light text-white/70"
          >
            The all-in-one platform for gym owners to manage members, classes,
            staff, and locations. Streamline your operations and grow your
            fitness business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => navigate("/signup")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Start Free Trial
              <IconChevronRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto"
            >
              Login to Dashboard
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4"
          >
            {[
              { num: "500+", label: "Gyms Onboarded" },
              { num: "50K+", label: "Members Managed" },
              { num: "99.9%", label: "Uptime" },
              { num: "24/7", label: "Support Available" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <p className="font-bebas text-4xl text-primary">{num}</p>
                <p className="mt-1 text-xs text-white/50">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section className="bg-[#09090B] py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-10 text-center text-xs font-medium uppercase tracking-widest text-white/30">
              The platform built for growth
            </p>
            <div className="rounded-[17px] bg-gradient-to-b from-white/10 to-transparent p-px shadow-[rgba(250,190,18,0.06)_0px_32px_60px_-12px]">
              <div className="overflow-hidden rounded-[16px] bg-[#1C1C1F]">
                <div className="flex items-center gap-3 border-b border-white/5 bg-[#141414] px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                    <div className="h-3 w-3 rounded-full bg-white/10" />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <div className="flex h-5 w-52 items-center justify-center rounded bg-white/5 text-[10px] text-white/30">
                      app.activehive.com
                    </div>
                  </div>
                </div>
                <img
                  src={dashboardImage}
                  alt="ActiveHive Dashboard"
                  className="w-full"
                />
              </div>
            </div>
            <div className="mx-auto mt-3 h-2 w-3/4 rounded-full bg-primary/10 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative bg-[#09090B] py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-primary">
              Platform Features
            </span>
            <h2 className="mt-3 text-4xl text-white md:text-5xl">
              EVERYTHING YOU NEED TO RUN YOUR GYM
            </h2>
            <p className="mt-4 font-light text-white/55">
              Powerful features designed to help you manage every aspect of your
              fitness business.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="mt-5 text-xl text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-white/50">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-[#09090B] py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-medium uppercase tracking-widest text-primary">
                Why ActiveHive
              </span>
              <h2 className="mt-3 text-4xl text-white md:text-5xl">
                THE PLATFORM GYM OWNERS TRUST
              </h2>
              <p className="mt-4 font-light text-white/55">
                Join hundreds of gym owners who trust ActiveHive to power their
                fitness businesses.
              </p>
              <ul className="mt-10 space-y-4">
                {benefits.map((benefit, i) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <IconCheck size={11} className="text-primary" />
                    </div>
                    <span className="text-sm text-white/70">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 flex items-center gap-4"
              >
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Create Free Account
                  <IconChevronRight size={16} />
                </button>
                <p className="text-xs text-white/35">No credit card required</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ height: "500px" }}
              >
                <img
                  src={gymSideImage}
                  alt="Gym floor"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/70 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/10 bg-[#09090B]/80 p-5 backdrop-blur-md">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-bebas text-3xl text-primary">500+</p>
                    <p className="mt-0.5 text-[10px] text-white/45">Gyms</p>
                  </div>
                  <div className="border-x border-white/10">
                    <p className="font-bebas text-3xl text-primary">50K+</p>
                    <p className="mt-0.5 text-[10px] text-white/45">Members</p>
                  </div>
                  <div>
                    <p className="font-bebas text-3xl text-primary">14</p>
                    <p className="mt-0.5 text-[10px] text-white/45">
                      Day Free Trial
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section className="border-y border-white/10 bg-[#09090B] py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {statsData.map(({ num, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-bebas text-5xl text-primary md:text-6xl">
                  {num}
                </p>
                <p className="mt-2 text-xs text-white/45">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Gym Goers + App Download ── */}
      <section id="app" className="bg-[#09090B] py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-medium uppercase tracking-widest text-primary">
                For Gym Goers
              </span>
              <h2 className="mt-3 text-4xl text-white md:text-5xl">
                YOUR FITNESS JOURNEY,{" "}
                <span className="text-primary">UPGRADED</span>
              </h2>
              <p className="mt-4 font-light text-white/55">
                The ActiveHive mobile app gives gym members the tools to stay
                consistent, connected, and in control of their fitness.
              </p>
              <ul className="mt-8 space-y-3">
                {gymGoerFeatures.map(({ icon: Icon, label }, i) => (
                  <motion.li
                    key={label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <span className="text-sm text-white/65">{label}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 transition-all hover:border-white/30 hover:bg-white/10"
                >
                  <IconBrandApple size={28} className="text-white" />
                  <div>
                    <p className="text-[10px] font-light text-white/45">
                      Download on the
                    </p>
                    <p className="text-sm font-medium text-white">App Store</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 transition-all hover:border-white/30 hover:bg-white/10"
                >
                  <IconBrandAndroid size={28} className="text-white" />
                  <div>
                    <p className="text-[10px] font-light text-white/45">
                      Get it on
                    </p>
                    <p className="text-sm font-medium text-white">
                      Google Play
                    </p>
                  </div>
                </a>
              </div>
              <p className="mt-4 text-xs text-white/25">
                Coming soon to iOS and Android
              </p>
            </motion.div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex justify-center"
            >
              <div className="relative w-64">
                <div className="rounded-[36px] border border-white/20 bg-[#1C1C1F] p-4 shadow-[0_0_80px_rgba(250,190,18,0.08)]">
                  <div className="overflow-hidden rounded-[28px] bg-[#09090B]">
                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                      <span className="text-[10px] text-white/50">9:41</span>
                      <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
                        <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
                        <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
                      </div>
                    </div>
                    <div className="px-4 pb-8 pt-2">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-white/35">
                            Good morning
                          </p>
                          <p className="text-xs font-medium text-white">
                            Alex Johnson
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bebas text-sm text-primary">
                            AJ
                          </span>
                        </div>
                      </div>
                      <div className="mb-3 rounded-xl border border-primary/20 bg-primary/10 p-3">
                        <p className="text-[8px] font-medium uppercase tracking-wide text-primary/70">
                          Membership
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-white">
                          Professional Plan
                        </p>
                        <div className="mt-2 h-1 rounded-full bg-white/10">
                          <div className="h-1 w-3/4 rounded-full bg-primary" />
                        </div>
                        <p className="mt-1 text-[8px] text-white/35">
                          23 days remaining
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="mb-2 text-[8px] font-medium uppercase tracking-wide text-white/35">
                          Next Class
                        </p>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[11px] font-medium text-white">
                                Morning HIIT
                              </p>
                              <p className="text-[8px] text-white/35">
                                Today • 7:00 AM
                              </p>
                            </div>
                            <div className="rounded bg-primary/20 px-2 py-0.5 text-[8px] font-medium text-primary">
                              Booked
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: IconQrcode, label: "Check In" },
                          { icon: IconCalendar, label: "Classes" },
                        ].map(({ icon: Icon, label }) => (
                          <div
                            key={label}
                            className="flex flex-col items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-3"
                          >
                            <Icon size={14} className="text-primary" />
                            <p className="text-[8px] text-white/45">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-auto mt-4 h-4 w-3/4 rounded-full bg-primary/10 blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-[#09090B] py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-primary">
              Pricing
            </span>
            <h2 className="mt-3 text-4xl text-white md:text-5xl">
              SIMPLE, TRANSPARENT PRICING
            </h2>
            <p className="mt-4 font-light text-white/55">
              Choose the plan that fits your gym's needs. All plans include a
              14-day free trial.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}
                <div
                  className={`relative h-full overflow-hidden rounded-2xl border p-6 transition-all ${
                    plan.popular
                      ? "border-primary/40 bg-primary/5 shadow-[rgba(250,190,18,0.1)_0px_25px_50px_-12px]"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  )}
                  <div className="relative">
                    <h3 className="text-2xl text-white">{plan.name}</h3>
                    <p className="mt-1 text-sm font-light text-white/45">
                      {plan.description}
                    </p>
                    <div className="mt-5">
                      <span className="font-bebas text-5xl text-white">
                        {plan.price}
                      </span>
                      {plan.period !== "pricing" && (
                        <span className="ml-2 text-sm text-white/35">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <div className="my-6 border-t border-white/10" />
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                            <IconCheck size={11} className="text-primary" />
                          </div>
                          <span className="text-sm text-white/60">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => navigate("/signup")}
                      className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-colors ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      Get Started
                      <IconChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-[#09090B] py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-primary">
              FAQ
            </span>
            <h2 className="mt-3 text-4xl text-white md:text-5xl">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="mt-4 font-light text-white/55">
              Everything you need to know about ActiveHive.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-white/10"
                >
                  <AccordionTrigger className="text-left text-sm font-medium text-white hover:text-primary hover:no-underline [&[data-state=open]]:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-light text-white/50">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-[#09090B] py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-12 text-center md:p-16">
              <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative">
                <h2 className="text-4xl text-white md:text-5xl">
                  TRANSFORM YOUR GYM
                  <br />
                  <span className="text-primary">MANAGEMENT TODAY</span>
                </h2>
                <p className="mx-auto mt-6 max-w-lg font-light text-white/55">
                  Join ActiveHive and experience the difference. Start your free
                  trial now — no credit card required.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <button
                    onClick={() => navigate("/signup")}
                    className="flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Get Started Free
                    <IconChevronRight size={16} />
                  </button>
                  <p className="text-xs text-white/35">
                    Questions?{" "}
                    <a
                      href="mailto:mail@activehive.com"
                      className="text-white/55 transition-colors hover:text-primary"
                    >
                      mail@activehive.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-[#09090B] py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <Logo path="/" />
              <p className="mt-4 text-sm font-light text-white/35">
                The all-in-one platform for gym management in Nigeria.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/35">
                Product
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {["Features", "Pricing", "Updates"].map((item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-white/50 transition-colors hover:text-white"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/35">
                Company
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {["About", "Blog", "Careers"].map((item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-white/50 transition-colors hover:text-white"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/35">
                Support
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {["Help Center", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-white/50 transition-colors hover:text-white"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="tel:+2349388338"
                    className="text-white/50 transition-colors hover:text-white"
                  >
                    +234 938 8338
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:mail@activehive.com"
                    className="text-white/50 transition-colors hover:text-white"
                  >
                    mail@activehive.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 text-center">
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} ActiveHive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
