import { Star } from "lucide-react";
import Link from "next/link";

export default function TestimonialsPage() {
  const reviews = [
    { name: "Sarah O'Connor", treatment: "Composite Bonding", text: "Dr. Roghay is absolutely amazing. I was terrified of going to the dentist for years, but she was incredibly gentle, patient, and explained everything step by step. My teeth bonding looks completely natural.", rating: 5, date: "May 2026" },
    { name: "Michael Harrington", treatment: "Porcelain Veneers", text: "Hollyhill Dental completely transformed my smile. The team is friendly, professional, and the clinic feels like a premium hotel. I couldn't be happier with my new veneers.", rating: 5, date: "April 2026" },
    { name: "Patrick Kelleher", treatment: "Invisalign", text: "I finished my Invisalign treatment here and the results are perfect. The interest-free monthly instalment plan made it super easy to pay. Highly recommend!", rating: 5, date: "March 2026" },
    { name: "Laura Dineen", treatment: "Teeth Whitening", text: "Quick, painless, and my teeth are literally glowing. Got so many compliments at my wedding last weekend. Excellent clean clinic.", rating: 5, date: "February 2026" },
    { name: "John McCarthy", treatment: "General Dentistry", text: "A routine examination that was thorough and informative. Dr. Roghay explained what she was doing at all times. Professional team.", rating: 5, date: "January 2026" },
    { name: "Emma Crowley", treatment: "Root Canal Treatment", text: "I was in agony with a toothache and they got me in on the same day. Root canal was painless. Incredible relief. Thank you!", rating: 5, date: "December 2025" }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Interior Hero */}
      <section className="bg-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-40" />
        <div className="relative z-10 space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Patient Reviews</h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-wide uppercase">
            Hear directly from our Cork family of happy patients
          </p>
        </div>
      </section>

      {/* Ratings Summary Chart */}
      <section className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-100 pb-12">
        <div className="text-center space-y-2">
          <div className="text-5xl font-serif font-bold text-navy">5.0</div>
          <div className="flex justify-center text-gold">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <p className="text-xs text-gray-500 font-medium">Based on 500+ verified Google Reviews</p>
        </div>

        {/* Bar chart layout */}
        <div className="space-y-2 text-xs text-navy font-semibold">
          <div className="flex items-center gap-3">
            <span className="w-8 shrink-0">5 Star</span>
            <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gold w-[98%]" />
            </div>
            <span className="w-8 text-right">98%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 shrink-0">4 Star</span>
            <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gold w-[2%]" />
            </div>
            <span className="w-8 text-right">2%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 shrink-0">3 Star</span>
            <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gold w-[0%]" />
            </div>
            <span className="w-8 text-right">0%</span>
          </div>
        </div>
      </section>

      {/* Video Reviews Simulator */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <h3 className="text-xl font-serif font-bold text-navy text-center">Video Testimonials</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((v) => (
            <div key={v} className="aspect-video bg-navy rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-md border border-gray-100">
              {/* Play symbol */}
              <div className="w-12 h-12 rounded-full bg-gold/90 text-navy flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform cursor-pointer">
                &#9654;
              </div>
              <span className="absolute bottom-3 left-3 text-[10px] bg-black/40 text-white px-2 py-0.5 rounded">
                Transformation Diary {v}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Review cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-gold transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-bold text-navy">{r.name}</h4>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gold">{r.treatment}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{r.date}</span>
                </div>
                <div className="flex text-gold mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-xs leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google Link CTA */}
      <section className="max-w-xl mx-auto px-4 text-center space-y-4">
        <h4 className="font-serif text-lg font-semibold text-navy">Had a 5-Star Visit?</h4>
        <p className="text-gray-500 text-xs">
          Your feedback supports our Cork clinic and helps other patients find gentle clinical care.
        </p>
        <a
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gold hover:bg-gold-dark text-navy font-bold text-xs px-6 py-3 rounded-lg shadow transition-colors uppercase tracking-wider"
        >
          Write Google Review &rarr;
        </a>
      </section>

    </div>
  );
}
