"use client";

import { Heart, Coffee, CreditCard } from 'lucide-react';

export default function DonatePage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center mb-16">
                <div className="inline-block p-4 rounded-full bg-rose-50 mb-6">
                    <Heart className="w-12 h-12 text-rose-600 fill-current" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Support DocMorph</h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    We keep DocMorph free and accessible for everyone. If this tool helped you, consider supporting us to help cover server costs!
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                    { amount: 5, label: "Buy us a coffee", icon: Coffee },
                    { amount: 10, label: "Server contributor", icon: Heart },
                    { amount: 25, label: "Super supporter", icon: CreditCard }
                ].map((tier) => (
                    <div key={tier.amount} className="border border-gray-200 rounded-2xl p-8 hover:border-rose-200 hover:shadow-lg transition-all cursor-pointer group bg-white text-center">
                        <div className="mx-auto bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-rose-50 transition-colors">
                            <tier.icon className="w-8 h-8 text-gray-400 group-hover:text-rose-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{tier.label}</h3>
                        <p className="text-3xl font-bold text-rose-600 mb-6">${tier.amount}</p>
                        <button
                            onClick={() => window.open("https://www.buymeacoffee.com/madhankumar", "_blank")}
                            className="w-full py-3 rounded-lg border-2 border-rose-600 text-rose-600 font-bold hover:bg-rose-600 hover:text-white transition-all"
                        >
                            Donate ${tier.amount}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Other ways to support</h3>
                <p className="text-gray-600 mb-6">You can also spread the word by sharing DocMorph with your friends and colleagues!</p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <a
                        href="https://instagram.com/mannmadhannnn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
                    >
                        Follow on Instagram
                    </a>
                    <a
                        href="https://x.com/MadhanK48272026"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
                    >
                        Follow on X
                    </a>
                    <a
                        href="https://github.com/madhankumarp1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
                    >
                        Follow on GitHub
                    </a>
                </div>
            </div>
        </div>
    );
}
