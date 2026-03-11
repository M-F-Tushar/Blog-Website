import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Github,
  Linkedin,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SEO from './common/SEO';
import { messageService } from '../services/messageService';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string; // Spam prevention - should remain empty
}

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What's the best way to reach you?",
    answer:
      'Email is the best way to reach me for any inquiries. I typically reply quickly.',
  },
  {
    question: 'Can you help with my project?',
    answer:
      'I&apos;d love to hear about your project! Send me an email with details about what you&apos;re building, your timeline, and how I can help.',
  },
  {
    question: 'Do you accept guest posts?',
    answer:
      "Yes, I accept high-quality guest posts that align with my blog's topics. Please email me with your proposed topic and a brief outline.",
  },
  {
    question: 'How can I collaborate with you?',
    answer:
      "I'm always open to collaboration opportunities! Whether it's content creation, open-source projects, or speaking engagements, feel free to reach out via email.",
  },
];

const Contact: React.FC = () => {
  const { authorName, socialLinks } = useSiteSettings();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // Spam prevention
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validation constants
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_MESSAGE_LENGTH = 10;
  const MAX_MESSAGE_LENGTH = 5000;
  const MAX_NAME_LENGTH = 100;
  const MAX_SUBJECT_LENGTH = 200;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length > MAX_NAME_LENGTH) {
      errors.name = `Name must be less than ${MAX_NAME_LENGTH} characters`;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.length > MAX_SUBJECT_LENGTH) {
      errors.subject = `Subject must be less than ${MAX_SUBJECT_LENGTH} characters`;
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < MIN_MESSAGE_LENGTH) {
      errors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
    } else if (formData.message.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's a bot
    if (formData.honeypot) {
      // Silently reject
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setFormStatus('sending');

    try {
      // Use Supabase message service
      await messageService.sendMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      setValidationErrors({});
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.message;

  return (
    <div className="space-y-24 pb-12">
      <SEO
        title="Contact"
        description={`Get in touch with ${authorName}. Available for consulting, collaboration, and inquiries.`}
      />
      {/* Header */}
      <section className="relative py-12 md:py-16 bg-secondary-50 dark:bg-secondary-900/50 -mt-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 mb-6 shadow-sm">
            <Sparkles size={16} className="text-accent-500" />
            <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">
              Get in Touch
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-serif text-secondary-900 dark:text-white mb-6">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto leading-relaxed">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be
            part of an amazing team.
          </p>
        </motion.div>

        {/* Background Decor */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl" />
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Availability & Response Time */}
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Clock size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
                Currently Available
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                I usually respond within{' '}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  24-48 hours
                </span>{' '}
                during business days. For urgent matters, please mention &quot;URGENT&quot; in the
                subject line.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold font-serif text-secondary-900 dark:text-white mb-8 flex items-center gap-2">
              <MessageSquare size={24} className="text-primary-500" />
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users, visible to bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="honeypot">Leave this field empty</label>
                <input
                  type="text"
                  id="honeypot"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                >
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                  aria-invalid={!!validationErrors.name}
                  aria-describedby={validationErrors.name ? 'name-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-secondary-800 border ${validationErrors.name ? 'border-red-500' : 'border-secondary-200 dark:border-secondary-700'} focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none`}
                  placeholder="John Doe"
                />
                {validationErrors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-invalid={!!validationErrors.email}
                  aria-describedby={validationErrors.email ? 'email-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-secondary-800 border ${validationErrors.email ? 'border-red-500' : 'border-secondary-200 dark:border-secondary-700'} focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none`}
                  placeholder="john@example.com"
                />
                {validationErrors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  maxLength={200}
                  aria-invalid={!!validationErrors.subject}
                  aria-describedby={validationErrors.subject ? 'subject-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-secondary-800 border ${validationErrors.subject ? 'border-red-500' : 'border-secondary-200 dark:border-secondary-700'} focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none`}
                  placeholder="Project Inquiry"
                />
                {validationErrors.subject && (
                  <p id="subject-error" className="mt-1 text-sm text-red-500" role="alert">
                    {validationErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid || formStatus === 'sending'}
                className="w-full px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
              >
                {formStatus === 'sending' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>

              <AnimatePresence>
                {formStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle
                      size={20}
                      className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Message sent successfully!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        I&apos;ll get back to you as soon as possible.
                      </p>
                    </div>
                  </motion.div>
                )}
                {formStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle
                      size={20}
                      className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-100">
                        Failed to send message
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Please try again or email me directly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Social Cards & FAQ */}
          <div className="space-y-12">
            {/* Preferred Contact Method */}
            <div>
              <h2 className="text-2xl font-bold font-serif text-secondary-900 dark:text-white mb-8">
                Connect Elsewhere
              </h2>

              <div className="space-y-4">
                {/* Email Card - Preferred */}
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="block p-6 bg-gradient-to-br from-primary-600 to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-3 bg-white/10 rounded-bl-2xl backdrop-blur-sm">
                    <span className="text-xs font-bold tracking-wider">PREFERRED</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Mail size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">Email</h3>
                      <p className="text-sm text-white/90 mb-2">Best for professional inquiries</p>
                      <p className="text-sm font-mono text-white/80 bg-black/20 inline-block px-2 py-1 rounded">
                        {socialLinks.email}
                      </p>
                    </div>
                  </div>
                </a>

                {/* GitHub Card */}
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-secondary-900 dark:bg-secondary-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 border border-secondary-800 dark:border-secondary-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                      <Github size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">GitHub</h3>
                      <p className="text-sm text-secondary-400">Check out my open-source work</p>
                    </div>
                  </div>
                </a>

                {/* LinkedIn Card */}
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-[#0077b5] text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                      <Linkedin size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">LinkedIn</h3>
                      <p className="text-sm text-white/90">Connect professionally</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-bold font-serif text-secondary-900 dark:text-white mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
                    >
                      <span className="font-semibold text-secondary-900 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`text-secondary-400 flex-shrink-0 transition-transform duration-300 ${expandedFAQ === index ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-6 pb-4 pt-0 text-secondary-600 dark:text-secondary-300">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
