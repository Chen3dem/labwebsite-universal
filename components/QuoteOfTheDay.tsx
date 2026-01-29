"use client";

import { useState, useEffect } from "react";

const QUOTES = [
    // Science & Discovery
    {
        text: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
        author: "Marie Curie"
    },
    {
        text: "Somewhere, something incredible is waiting to be known.",
        author: "Carl Sagan"
    },
    {
        text: "The good thing about science is that it's true whether or not you believe in it.",
        author: "Neil deGrasse Tyson"
    },
    {
        text: "The most beautiful experience we can have is the mysterious. It is the fundamental emotion that stands at the cradle of true art and true science.",
        author: "Albert Einstein"
    },
    // Wisdom & Philosophy
    {
        text: "The only true wisdom is in knowing you know nothing.",
        author: "Socrates"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
        author: "Aristotle"
    },
    {
        text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
        author: "Ralph Waldo Emerson"
    },
    {
        text: "In the middle of every difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    // Literature & Life
    {
        text: "It is never too late to be what you might have been.",
        author: "George Eliot"
    },
    {
        text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
        author: "Ralph Waldo Emerson"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu"
    },
    {
        text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        author: "Ralph Waldo Emerson"
    },
    {
        text: "Science is a way of thinking much more than it is a body of knowledge.",
        author: "Carl Sagan"
    },
    {
        text: "The important thing is not to stop questioning. Curiosity has its own reason for existence.",
        author: "Albert Einstein"
    },
    {
        text: "Research is seeing what everybody else has seen and thinking what nobody else has thought.",
        author: "Albert Szent-Györgyi"
    },
    {
        text: "All truths are easy to understand once they are discovered; the point is to discover them.",
        author: "Galileo Galilei"
    },
    {
        text: "To know, is to know that you know nothing. That is the meaning of true knowledge.",
        author: "Socrates"
    },
    {
        text: "Science knows no country, because knowledge belongs to humanity, and is the torch which illuminates the world.",
        author: "Louis Pasteur"
    },
    {
        text: "Life need not be easy, provided only that it is not empty.",
        author: "Lise Meitner"
    },
    {
        text: "If I have seen further, it is by standing on the shoulders of giants.",
        author: "Isaac Newton"
    },
    {
        text: "The universe is under no obligation to make sense to you.",
        author: "Neil deGrasse Tyson"
    }
];

export default function QuoteOfTheDay() {
    const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

    useEffect(() => {
        // Use local quotes strictly to ensure quality (Scientists & Philosophers)
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setQuote(QUOTES[randomIndex]);
    }, []);

    if (!quote) return null;

    return (
        <div className="text-center px-4 animate-fade-in w-full">
            <blockquote className="max-w-5xl mx-auto">
                <p className="text-slate-400 font-light italic mb-2 text-sm md:text-base">
                    &quot;{quote.text}&quot;
                </p>
                <footer className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    — {quote.author}
                </footer>
            </blockquote>
        </div>
    );
}
