"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Plus, Search, FileText, Globe, NotebookPen } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCategory, setEditCategory] = useState("general");
  const [editStatus, setEditStatus] = useState("draft");
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    apiRequest("/blog?status=all")
      .then((data) => {
        setPosts(data);
        if (data.length > 0) handleSelectPost(data[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleSelectPost = (post: any) => {
    setActivePost(post);
    setEditTitle(post.title);
    setEditBody(post.body);
    setEditCategory(post.category);
    setEditStatus(post.status);
  };

  const handleCreatePost = async () => {
    setBtnLoading(true);
    try {
      const slug = editTitle.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      const result = await apiRequest("/blog", {
        method: "POST",
        body: JSON.stringify({
          title: "New Draft Post",
          slug: "new-draft-post-" + Math.floor(Math.random()*100),
          body: "<p>Write content here...</p>",
          category: "general",
          status: "draft",
        }),
      });

      setPosts(prev => [result.post, ...prev]);
      handleSelectPost(result.post);
      toast.success("New draft generated.");
    } catch (error) {
      toast.error("Failed to build draft.");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSavePost = async () => {
    if (!activePost) return;
    setBtnLoading(true);
    try {
      const slug = editTitle.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      const result = await apiRequest(`/blog/${activePost.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
          slug,
          body: editBody,
          category: editCategory,
          status: editStatus,
        }),
      });

      setPosts(prev => prev.map(p => p.id === activePost.id ? result.post : p));
      toast.success("Article saved.");
    } catch (error) {
      toast.error("Save failed.");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">Blog CMS</h1>
          <p className="text-gray-500 text-xs mt-1">Publish clinical studies, guidelines, and marketing bulletins</p>
        </div>
        <button
          onClick={handleCreatePost}
          className="bg-gold hover:bg-gold-dark text-navy font-bold px-4 py-2 rounded-lg text-xs shadow flex items-center gap-1 focus:outline-none"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {loading ? (
        <div className="h-[300px] shimmer rounded-2xl" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-[calc(100vh-210px)] min-h-[460px]">
          
          {/* Left Column (Article Feed List) */}
          <div className="lg:col-span-4 border border-gray-200 bg-white rounded-2xl p-4 space-y-4 h-full overflow-y-auto">
            <h3 className="font-serif text-sm font-bold text-navy">All Drafts & Published</h3>
            <div className="space-y-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleSelectPost(post)}
                  className={`p-3 rounded-xl border cursor-pointer hover:border-gold transition-colors flex items-center gap-3 ${
                    activePost?.id === post.id ? "border-gold bg-gold/5" : "border-gray-100 bg-white"
                  }`}
                >
                  <NotebookPen className="w-4 h-4 text-gold shrink-0" />
                  <div className="truncate flex-1">
                    <span className="block text-xs font-bold text-navy truncate">{post.title}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block mt-0.5">
                      Status: {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Editor Workstation) */}
          <div className="lg:col-span-8 border border-gray-200 bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between overflow-y-auto">
            {activePost ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-navy">Article Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs font-bold text-navy focus:outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-navy">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                      >
                        <option value="dental-health">Dental Health</option>
                        <option value="cosmetic">Cosmetic</option>
                        <option value="orthodontics">Orthodontics</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-navy">Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-navy">Body Content (HTML Markup Allowed)</label>
                    <textarea
                      rows={10}
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none font-mono resize-none flex-1"
                    />
                  </div>
                </div>

                <div className="flex gap-4 border-t border-gray-100 pt-4 mt-6">
                  <button
                    onClick={handleSavePost}
                    disabled={btnLoading}
                    className="bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 px-8 rounded-lg text-xs shadow-md transition-colors disabled:opacity-50"
                  >
                    {btnLoading ? "Saving..." : "Save Article &rarr;"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Create or select an article to open the workstation.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
