'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated submission (in real app, send to API)
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-5xl font-bold mb-8 text-center text-orange-600">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Get in Touch</h3>
            <p className="text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-2">📍 Location</h4>
            <p className="text-gray-600">123 Food Street<br />Montpellier, 34000<br />France</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-2">📞 Phone</h4>
            <p className="text-gray-600">+33 (0)4 67 XX XX XX</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-2">📧 Email</h4>
            <p className="text-gray-600">hello@eatquick.fr</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {submitted && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Thank you! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="+33 (0)X XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Subject"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}