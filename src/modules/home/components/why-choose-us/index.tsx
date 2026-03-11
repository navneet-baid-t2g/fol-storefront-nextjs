"use client";
import { useState, FC } from "react";
interface AccordionItem {
    title: string;
    content: string[];
}
const accordionItems: AccordionItem[] = [
    {
        title: "Wide Applications",
        content: [
            "Perimeter security solution for fence, buried, wall, pipeline, data networks, and hybrid mediums",
            "Complete suite of products ranging from 10 m to 100 km",
            "Offers simple zone system up to 32 zones to high-tech classification systems",
            "Uses fiber-optic sensors, immune to EMI/RFI/Lightning",
        ],
    },
    {
        title: "High Reliability",
        content: ["High reliability description goes here..."],
    },
    {
        title: "Easy Deployment",
        content: ["Easy deployment description goes here..."],
    },
    {
        title: "Top Performance",
        content: ["Top performance description goes here..."],
    },
    {
        title: "Flexible Integration",
        content: ["Flexible integration description goes here..."],
    },
];
export default function WhyChooseUs() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    return <div className="why-choose-us p-10 rounded-xl shadow-sm">
        <h2 className="text-center text-2xl">Why Choose Us?</h2>


        {accordionItems.map((item, index) => (
            <div key={index} className="border-b border-gray-300 py-4">
                {/* Header */}
                <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between font-semibold text-lg"
                >
                    <div className="flex items-center gap-2">
                        <span className="bullet"></span> {item.title}
                    </div>
                    <span className="text-xl">
                        {openIndex === index ? "−" : "+"}
                    </span>
                </button>

                {/* Content */}
                {openIndex === index && (
                    <ul className="mt-3 list-disc ml-8 text-gray-700 animate-fadeIn">
                        {item.content.map((text, i) => (
                            <li key={i}>{text}</li>
                        ))}
                    </ul>
                )}
            </div>
        ))}
    </div>
}