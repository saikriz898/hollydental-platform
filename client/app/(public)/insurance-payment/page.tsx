import { CLINIC } from "@/lib/constants";
import { ShieldCheck, HeartHandshake, CreditCard, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function InsurancePaymentPage() {
  const providers = [
    { name: "VHI Healthcare", desc: "Covers standard checkups and up to 70% of restorative procedures depending on policy." },
    { name: "Laya Healthcare", desc: "Direct pay arrangements available for complex oral restorations and treatments." },
    { name: "Irish Life Health", desc: "Claim back procedure costs directly using your patient portal invoices." }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Interior Hero */}
      <section className="bg-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-40" />
        <div className="relative z-10 space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Insurance & Payment Plans</h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-wide uppercase">
            Affordable care with interest-free finance and insurance integration
          </p>
        </div>
      </section>

      {/* Insurance Provider Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <h3 className="text-xl font-serif font-bold text-navy text-center">Supported Health Insurers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {providers.map((p, idx) => (
            <div key={idx} className="border border-gray-100 bg-white rounded-2xl p-6 shadow-sm hover:border-gold transition-colors space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs uppercase">
                {p.name.substring(0, 3)}
              </div>
              <h4 className="font-serif text-sm font-bold text-navy">{p.name}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRSI Benefit Card */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-off-white border border-gray-100 rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-base font-bold text-navy">PRSI Dental Treatment Benefit Scheme</h3>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed">
            If you pay PRSI in Ireland, you may be entitled to state-subsidized benefits under the Treatment Benefit Scheme:
          </p>
          <ul className="space-y-2 text-xs text-gray-500 pl-4 list-disc">
            <li>**One Free Dental Examination** per calendar year.</li>
            <li>**Subsidized Cleaning (Scale & Polish)** - Only €15 charge (saving €55 off standard price).</li>
            <li>We check your PPSN eligibility instantly in the clinic.</li>
          </ul>
        </div>
      </section>

      {/* Instalment Table */}
      <section className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-serif font-bold text-navy">0% Interest Instalments</h3>
          <p className="text-gray-500 text-xs">Spread the cost of your treatment plan over easy monthly intervals</p>
        </div>

        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-navy text-white">
              <tr>
                <th className="p-4">Treatment Total</th>
                <th className="p-4">Initial Deposit</th>
                <th className="p-4">Monthly Payment (12 Months)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-4 font-semibold text-navy">&euro;2,500.00</td>
                <td className="p-4">&euro;500.00</td>
                <td className="p-4 font-bold text-gold">&euro;166.66 / mo</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4 font-semibold text-navy">&euro;4,000.00</td>
                <td className="p-4">&euro;800.00</td>
                <td className="p-4 font-bold text-gold">&euro;266.66 / mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-navy text-white rounded-2xl p-10 text-center space-y-4">
          <h3 className="text-2xl font-serif font-semibold">Have Questions About Payment Options?</h3>
          <p className="text-gray-300 text-xs">
            Our clinic treatment coordinators are here to assist. Phone us directly.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <a href={CLINIC.phoneHref} className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs px-6 py-3 rounded-lg shadow">
              Call {CLINIC.phone}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
