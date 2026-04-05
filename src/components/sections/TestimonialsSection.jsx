import React from 'react';
import { TestimonialCard } from '../ui/Card';
import './TestimonialsSection.css';

export const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "We listed 2 tonnes of aluminum offcuts and got matched with a buyer within 4 minutes. Wastify changed how we think about surplus.",
            name: "Rajiv M.",
            role: "Scrap Metal Dealer",
            initials: "RM"
        },
        {
            quote: "Finally a platform where I can trust the classification. The AI grading is more reliable than manual sorting from our old suppliers.",
            name: "Sarah J.",
            role: "Procurement Manager",
            initials: "SJ"
        },
        {
            quote: "We onboarded our entire east zone collection. The analytics dashboard gives us data we've never had before.",
            name: "Anand D.",
            role: "MSW Officer",
            initials: "AD"
        }
    ];

    return (
        <section className="testimonials-section container" id="testimonials">
            <div className="section-header text-center reveal">
                <h2>Trusted by <span className="text-green">Waste Generators</span> & <br />Material Buyers</h2>
            </div>

            <div className="testimonials-grid reveal delay-1">
                {testimonials.map((test, idx) => (
                    <TestimonialCard
                        key={idx}
                        quote={test.quote}
                        name={test.name}
                        role={test.role}
                        initials={test.initials}
                    />
                ))}
            </div>
        </section>
    );
};
