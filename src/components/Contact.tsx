import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Send, Clock, CheckCircle, AlertCircle, ChevronDown, MessageSquare } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "What's the best way to reach you?",
        answer: "Email is the best way to reach me for professional inquiries. I typically respond within 24-48 hours during business days."
    },
    {
        question: "Do you offer consulting services?",
        answer: "Yes! I'm available for consulting on web development, React applications, and technical content creation. Please email me with details about your project."
    },
    {
        question: "Can you help with my project?",
        answer: "I'd love to hear about your project! Send me an email with details about what you're building, your timeline, and how I can help."
    },
    {
        question: "Do you accept guest posts?",
        answer: "I occasionally accept high-quality guest posts that align with my blog's topics. Please email me with your proposed topic and a brief outline."
    },
    {
        question: "How can I collaborate with you?",
        answer: "I'm always open to collaboration opportunities! Whether it's content creation, open-source projects, or speaking engagements, feel free to reach out via email."
    }
];

const Contact: React.FC = () => {
    const { authorName, socialLinks } = useSiteSettings();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    useSEO({
        title: 'Contact',
        description: `Get in touch with ${authorName}. Available for consulting, collaboration, and inquiries.`
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');

        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setFormStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });

            setTimeout(() => setFormStatus('idle'), 5000);
        }, 1500);
    };

    const isFormValid = formData.name && formData.email && formData.subject && formData.message;

    return (
        <div className="max-w-6xl mx-auto space-y-16">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white">
                    Let's Connect
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.
                </p>
            </div>

            {/* Availability & Response Time */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <Clock size={24} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Currently Available
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            I usually respond within <span className="font-semibold text-green-600 dark:text-green-400">24-48 hours</span> during business days.
                            For urgent matters, please mention "URGENT" in the subject line.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <MessageSquare size={28} />
                        Send a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Project Inquiry"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Message *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                                placeholder="Tell me about your project or inquiry..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid || formStatus === 'sending'}
                            className="w-full px-6 py-3 bg-accent hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3"
                                >
                                    <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-green-900 dark:text-green-100">Message sent successfully!</p>
                                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                            I'll get back to you as soon as possible.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            {formStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
                                >
                                    <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-red-900 dark:text-red-100">Failed to send message</p>
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
                <div className="space-y-8">
                    {/* Preferred Contact Method */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Other Ways to Connect
                        </h2>

                        <div className="space-y-4">
                            {/* Email Card - Preferred */}
                            <a
                                href={`mailto:${socialLinks.email}`}
                                className="block p-6 bg-gradient-to-br from-accent to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs font-semibold">
                                    PREFERRED
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/20 rounded-lg">
                                        <Mail size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">Email</h3>
                                        <p className="text-sm text-white/90 mb-2">Best for professional inquiries</p>
                                        <p className="text-sm font-mono text-white/80">{socialLinks.email}</p>
                                    </div>
                                </div>
                            </a>

                            {/* GitHub Card */}
                            <a
                                href={socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-6 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                        <Github size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">GitHub</h3>
                                        <p className="text-sm text-gray-300">Check out my open-source work</p>
                                    </div>
                                </div>
                            </a>

                            {/* LinkedIn Card */}
                            <a
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-6 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                                        <Linkedin size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">LinkedIn</h3>
                                        <p className="text-sm text-blue-100">Connect professionally</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 dark:text-white pr-4">
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            className={`text-gray-500 flex-shrink-0 transition-transform ${expandedFAQ === index ? 'rotate-180' : ''
                                                }`}
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
                                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {faq.answer}
                                                    </p>
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
    );
};

export default Contact;