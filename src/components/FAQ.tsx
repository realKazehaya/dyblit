import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      question: 'How do I earn diamonds?',
      answer:
        'Complete offers from our partners like Lootably, CPX Research, AdGateMedia, Ayet Studios, and Torox.',
    },
    {
      question: 'How long do withdrawals take?',
      answer: 'Withdrawals are typically processed within 24–48 hours.',
    },
    {
      question: "Why didn't I receive diamonds after completing an offer?",
      answer:
        'Make sure you followed all instructions. Sometimes it takes time for offerwalls to verify.',
    },
    {
      question: 'How many times can I change my nickname?',
      answer: 'You can only change your nickname twice.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <HelpCircle className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
            >
              <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}