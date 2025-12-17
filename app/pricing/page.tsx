"use client";

import { Check, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/lib/useUser';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PricingPage() {
    const { user } = useUser();
    const [tier, setTier] = useState<string>('free');

    useEffect(() => {
        if (user) {
            supabase
                .from('profiles')
                .select('tier')
                .eq('id', user.id)
                .single()
                .then(({ data }) => {
                    if (data) setTier(data.tier);
                });
        }
    }, [user]);

    const isPro = tier === 'pro' || tier === 'business';

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Choose the plan that fits your needs.
                    <span className="font-bold text-rose-600"> 100% Money-back guarantee</span> for 30 days.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Free Tier */}
                <div className={`border ${tier === 'free' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-white'} rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col`}>
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                        <p className="text-gray-500 mb-6">For casual PDF users</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-gray-900">$0</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                    </div>
                    <ul className="mb-8 space-y-4 flex-1">
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>Access to all basic tools</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>Merge, Split, Compress</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>Up to 5 files per task</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <X className="w-5 h-5 flex-shrink-0" />
                            <span>No priority support</span>
                        </li>
                    </ul>

                    {tier === 'free' ? (
                        <div className="block w-full py-3 px-6 text-center text-gray-500 font-bold bg-gray-100 border border-gray-200 rounded-xl cursor-default">
                            Current Plan
                        </div>
                    ) : (
                        <Link href="/" className="block w-full py-3 px-6 text-center text-rose-600 font-bold border-2 border-rose-100 rounded-xl hover:bg-rose-50 transition-colors">
                            Get Started
                        </Link>
                    )}
                </div>

                {/* Pro Tier (Popular) */}
                <div className={`border-2 ${isPro ? 'border-amber-400 bg-amber-50/10' : 'border-rose-500 bg-white'} rounded-2xl p-8 shadow-xl flex flex-col relative transform md:-translate-y-4 transition-all duration-300`}>
                    <div className={`absolute top-0 right-0 ${isPro ? 'bg-amber-500' : 'bg-rose-500'} text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl`}>
                        {isPro ? 'YOUR PLAN' : 'POPULAR'}
                    </div>
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                        <p className="text-gray-500 mb-6">For power users who do more</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-gray-900">$9</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                    </div>
                    <ul className="mb-8 space-y-4 flex-1">
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className={`w-5 h-5 ${isPro ? 'text-amber-500' : 'text-rose-500'} flex-shrink-0`} />
                            <span>Unlimited document size</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className={`w-5 h-5 ${isPro ? 'text-amber-500' : 'text-rose-500'} flex-shrink-0`} />
                            <span>Process unlimited files</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className={`w-5 h-5 ${isPro ? 'text-amber-500' : 'text-rose-500'} flex-shrink-0`} />
                            <span>No ads</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className={`w-5 h-5 ${isPro ? 'text-amber-500' : 'text-rose-500'} flex-shrink-0`} />
                            <span>Priority email support</span>
                        </li>
                    </ul>

                    {isPro ? (
                        <div className="block w-full py-3 px-6 text-center text-amber-600 font-bold bg-amber-100 border border-amber-200 rounded-xl shadow-inner cursor-default flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Current Plan Active
                        </div>
                    ) : (
                        <Link href="/donate" className="block w-full py-3 px-6 text-center text-white font-bold bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200">
                            Upgrade to Pro
                        </Link>
                    )}
                </div>

                {/* Business Tier */}
                <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-white flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
                        <p className="text-gray-500 mb-6">For teams and organizations</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-gray-900">$49</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                    </div>
                    <ul className="mb-8 space-y-4 flex-1">
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                            <span>Everything in Pro</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                            <span>Team management</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                            <span>API Access</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                            <span>Dedicated account manager</span>
                        </li>
                    </ul>
                    <Link href="/donate" className="block w-full py-3 px-6 text-center text-gray-900 font-bold border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        Contact Sales
                    </Link>
                </div>
            </div>
        </div>
    );
}
