"use client";

import { useState } from "react";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";
import Link from "next/link";
import BookButton from "@/components/public/BookButton";

export default function GalleryPage() {
  const [filter, setFilter] = useState("all");

  const categories = [
    { key: "all", label: "All Cases" },
    { key: "invisalign", label: "Invisalign" },
    { key: "veneers", label: "Veneers" },
    { key: "whitening", label: "Whitening" },
    { key: "bonding", label: "Bonding" },
    { key: "smile-design", label: "Smile Design" },
    { key: "restorative", label: "Crowns & Bridges" },
    { key: "general", label: "General & Hygiene" },
  ];

  const AFTER_IMG = "/image.png";

  const galleryItems = [
    {
      category: "veneers",
      treatmentName: "Porcelain Veneers",
      initials: "A.C.",
      before: "/before & after/Veneers_before.jpg",
      after: "/before & after/Veneers_after.jpg",
    },
    {
      category: "bonding",
      treatmentName: "Composite Bonding",
      initials: "P.K.",
      before: "/before & after/Composite Bonding_before.jpg",
      after: "/before & after/Composite Bonding_after.jpg",
    },
    {
      category: "restorative",
      treatmentName: "Dental Crowns",
      initials: "D.C.",
      before: "/before & after/Dental Crowns_before.png",
      after: "/before & after/Dental Crowns_after.png",
    },
    {
      category: "restorative",
      treatmentName: "Dental Bridges",
      initials: "D.B.",
      before: "/before & after/Bridges_before.png",
      after: "/before & after/Bridges_after.png",
    },
    {
      category: "bonding",
      treatmentName: "White Filling",
      initials: "W.F.",
      before: "/before & after/White Filling_before.jpg",
      after: "/before & after/White Filling_after.jpg",
    },
    {
      category: "general",
      treatmentName: "Tooth Extraction",
      initials: "T.E.",
      before: "/before & after/Tooth Extraction_before.jpg",
      after: "/before & after/Tooth Extraction_after.jpg",
    },
    {
      category: "invisalign",
      treatmentName: "Invisalign Full",
      initials: "I.F.",
      before: "/before & after/Invisalign Full_before.png",
      after: "/before & after/Invisalign Full_after.png",
    },
    {
      category: "invisalign",
      treatmentName: "Invisalign Go - Double",
      initials: "I.D.",
      before: "/before & after/Invisalign Go - Double_before.png",
      after: "/before & after/Invisalign Go - Double_after.png",
    },
    {
      category: "invisalign",
      treatmentName: "Invisalign Go - Single",
      initials: "I.G.",
      before: "/before & after/Invansion Go_before.png",
      after: "/before & after/Invansion Go_after.png",
    },
    {
      category: "smile-design",
      treatmentName: "Smile Design",
      initials: "S.D.",
      before: "/before & after/Smile Design_before.png",
      after: "/before & after/Smile Design_after.png",
    },
    {
      category: "general",
      treatmentName: "Hygiene & Teeth Cleaning",
      initials: "H.C.",
      before: "/before & after/Hygiene & Teeth Cleaning_before.png",
      after: "/before & after/Hygiene & Teeth Cleaning_after.png",
    },
    {
      category: "general",
      treatmentName: "Gum Treatment",
      initials: "G.T.",
      before: "/before & after/Gum Treatment_before.png",
      after: "/before & after/Gum Treatment_after.png",
    },
    {
      category: "whitening",
      treatmentName: "Teeth Whitening",
      initials: "T.W.",
      before: "/before & after/Teeth Whitening_before.jpg",
      after: "/before & after/Teeth Whitening_after.jpg",
    },
    {
      category: "general",
      treatmentName: "General Dentistry",
      initials: "G.D.",
      before: "/before & after/General Dentistry_Before.jpg",
      after: "/before & after/General Dentistry_After.jpg",
    },
    {
      category: "general",
      treatmentName: "Emergency Dentistry",
      initials: "E.D.",
      before: "/before & after/Emergency Dentistry_before.jpg",
      after: "/before & after/Emergency Dentistry_after.jpg",
    },
    {
      category: "restorative",
      treatmentName: "Dentures",
      initials: "D.T.",
      before: "/before & after/Dentures_before.png",
      after: "/before & after/Dentures_after.png",
    },
    {
      category: "general",
      treatmentName: "Surgical Extractions",
      initials: "S.E.",
      before: "/before & after/Surgical Extractions_before.png",
      after: "/before & after/Surgical Extractions.png",
    }
  ];

  const filteredItems = filter === "all" ? galleryItems : galleryItems.filter(item => item.category === filter);

  return (
    <div className="space-y-16 pb-16">

      {/* Interior Hero */}
      <section className="bg-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-40" />
        <div className="relative z-10 space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Smile Transformations</h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-wide uppercase">
            Real patient before-and-after results by Dr. Roghay Alizadeh
          </p>
        </div>
      </section>

      {/* Filter pills */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-100 pb-6">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`py-2 px-4 rounded-full text-xs font-semibold transition-all focus:outline-none ${filter === c.key ? "bg-gold text-navy" : "bg-gray-50 text-navy hover:bg-gray-100"
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        {filteredItems.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-xs text-gray-400">
            No transformations under this category yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
              <div key={idx} className="space-y-2 max-w-[360px] md:max-w-[480px] mx-auto w-full">
                <BeforeAfterSlider
                  treatmentName={item.treatmentName}
                  initials={item.initials}
                  beforeImage={item.before}
                  afterImage={item.after}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Consent disclaimer */}
      <section className="max-w-xl mx-auto px-4 text-center">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          * All clinical photographs displayed in this gallery have been published with the express written consent of the patients. Individual clinical results may vary.
        </p>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-navy text-white rounded-2xl p-10 text-center space-y-4">
          <h3 className="text-2xl font-serif font-semibold">Transform Your Smile</h3>
          <p className="text-gray-300 text-xs max-w-md mx-auto">
            Book a smile design consultation today and preview your results digitally.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <BookButton
              label="Book Online"
              className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs px-6 py-3 rounded-lg shadow cursor-pointer"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
