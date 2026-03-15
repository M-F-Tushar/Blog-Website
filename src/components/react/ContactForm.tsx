import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Props {
  formspreeEndpoint?: string;
  contactEmail?: string;
}

const COOLDOWN_MS = 30000; // 30 seconds between submissions

export default function ContactForm({ formspreeEndpoint, contactEmail }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'cooldown'>('idle');
  const lastSubmitRef = useRef<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitRef.current < COOLDOWN_MS) {
      setStatus('cooldown');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }
    lastSubmitRef.current = now;
    setStatus('sending');

    if (formspreeEndpoint) {
      try {
        const res = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTimeout(() => setStatus('idle'), 5000);
        } else {
          throw new Error('Failed');
        }
      } catch {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } else if (contactEmail) {
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const isValid = formData.name && formData.email && formData.subject && formData.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-secondary-300 mb-2"
        >
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          className="input-cosmic px-4 py-3 rounded-xl bg-surface"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-secondary-300 mb-2"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          maxLength={254}
          className="input-cosmic px-4 py-3 rounded-xl bg-surface"
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-secondary-300 mb-2"
        >
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          maxLength={200}
          className="input-cosmic px-4 py-3 rounded-xl bg-surface"
          placeholder="Project Inquiry"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-secondary-300 mb-2"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          maxLength={5000}
          className="input-cosmic px-4 py-3 rounded-xl bg-surface resize-none"
          placeholder="Tell me about your project or inquiry..."
        />
      </div>
      <button
        type="submit"
        disabled={!isValid || status === 'sending' || status === 'cooldown'}
        className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'sending' ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="M22 2 11 13"></path>
            </svg>
            Send Message
          </>
        )}
      </button>

      {status === 'success' && (
        <div role="alert" className="surface-subtle flex items-start gap-3 border-green-500/25 bg-green-500/10 p-4 animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-400 flex-shrink-0 mt-0.5"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <path d="m9 11 3 3L22 4"></path>
          </svg>
          <div>
            <p className="font-semibold text-green-100">
              Message sent successfully!
            </p>
            <p className="text-sm text-green-200 mt-1">
              I&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="surface-subtle flex items-start gap-3 border-red-500/25 bg-red-500/10 p-4 animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-400 flex-shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" x2="12" y1="8" y2="12"></line>
            <line x1="12" x2="12.01" y1="16" y2="16"></line>
          </svg>
          <div>
            <p className="font-semibold text-red-100">Failed to send message</p>
            <p className="text-sm text-red-200 mt-1">
              Please try again or email me directly.
            </p>
          </div>
        </div>
      )}
      {status === 'cooldown' && (
        <div role="alert" className="surface-subtle border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-200 animate-fade-in">
          Please wait a moment before sending another message.
        </div>
      )}
    </form>
  );
}
