import { apiRequest } from "@/lib/api";
import Link from "next/link";
import BookButton from "@/components/public/BookButton";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";
import { CLINIC } from "@/lib/constants";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;

  let post = null;
  try {
    post = await apiRequest(`/blog/${slug}`);
  } catch (error) {
    notFound();
  }
  
  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:text-gold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left main content column */}
        <article className="lg:col-span-8 space-y-6">
          <span className="text-[9px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold border-b border-gray-100 pb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold text-[10px]">
                RA
              </div>
              <span>{CLINIC?.doctor || "Dr. Roghay Alizadeh"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gold" /> {new Date(post.publishedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          {typeof post.body === "string" && post.body.length > 0 ? (
            <div
              className="prose prose-sm max-w-none text-gray-600 text-xs md:text-sm leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <p className="text-gray-400 text-xs italic">No content available for this article yet.</p>
          )}
        </article>

        {/* Right Sticky Sidebar */}
        <aside className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Booking Card */}
          <div className="bg-navy text-white rounded-2xl p-6 border border-white/5 shadow-lg space-y-4 text-center">
            <h4 className="font-serif text-base font-semibold text-white">Need a Checkup?</h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              Book a diagnostic visit or hygienist cleaning slot online instantly.
            </p>
            <BookButton
              label="Book Appointment →"
              className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs py-2.5 px-6 rounded-lg block w-full text-center shadow transition-colors cursor-pointer"
            />
          </div>

          {/* About Author Card */}
          <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm space-y-3">
            <h4 className="font-serif text-sm font-bold text-navy flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gold" /> About the Author
            </h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Dr. Roghay Alizadeh has over 20 years of clinical expertise. She publishes articles focusing on enamel safety, restorative methods, and patient comfort.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
