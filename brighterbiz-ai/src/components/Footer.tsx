'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Lightbulb, ArrowUpRight, ChevronUp, Mail, Linkedin, Twitter } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'AI Recommendations', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'Examples', href: '#examples' },
    { label: 'FAQ', href: '#faq' },
  ],
  resources: [
    { label: 'How It Works', href: '#features' },
    { label: 'Small Business Guide', href: '#examples' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { label: 'Email', icon: Mail, href: 'mailto:hello@brighterbiz.ai' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
  { label: 'Twitter', icon: Twitter, href: '#' },
];

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function Footer() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer ref={ref} className="relative overflow-hidden">
      {/* Accent gradient bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="bg-secondary">
        {/* Decorative background grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10"
        >
          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 pt-14 pb-12">
            {/* Brand column */}
            <motion.div variants={fadeUp} className="md:col-span-5 lg:col-span-4">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2.5 cursor-pointer group mb-5"
              >
                <div className="w-9 h-9 bg-black dark:bg-white rounded-xl flex items-center justify-center border border-primary transition-transform duration-300 group-hover:scale-105">
                  <Lightbulb className="w-[18px] h-[18px] text-white dark:text-black" />
                </div>
                <span className="text-[1.15rem] font-bold text-primary font-display tracking-tight">
                  BrighterBiz.ai
                </span>
              </button>
              <p className="text-secondary text-[0.9rem] leading-relaxed max-w-xs mb-6">
                Free, personalized AI recommendations that help small businesses
                <span className="font-accent italic text-primary"> work smarter</span> — no signup, no credit card, just results.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg border border-primary bg-primary flex items-center justify-center text-tertiary hover:text-primary hover:border-secondary hover:bg-tertiary transition-all duration-200"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Link columns */}
            <motion.div variants={fadeUp} className="md:col-span-3 lg:col-span-3 lg:col-start-6">
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-tertiary mb-4 font-display">
                Product
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group/link inline-flex items-center gap-1 text-secondary text-sm hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:translate-y-0 transition-all duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="md:col-span-3 lg:col-span-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-tertiary mb-4 font-display">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group/link inline-flex items-center gap-1 text-secondary text-sm hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-0.5 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:translate-y-0 transition-all duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgb(var(--color-border-primary))] to-transparent" />

          {/* Bottom bar */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6"
          >
            <p className="text-tertiary text-xs tracking-wide">
              &copy; {new Date().getFullYear()} BrighterBiz.ai&ensp;&middot;&ensp;Making AI accessible for small business.
            </p>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group flex items-center gap-1.5 text-xs text-tertiary hover:text-primary transition-colors duration-200"
            >
              Back to top
              <span className="w-6 h-6 rounded-md border border-primary bg-primary flex items-center justify-center group-hover:border-secondary group-hover:bg-tertiary transition-all duration-200">
                <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
