import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Send,
  Plus,
  Newspaper,
  Image as ImageIcon,
  Sparkles,
  Pin
} from 'lucide-react';

export const CommunityFeed: React.FC = () => {
  const { posts, news, addPost, likePost, addComment, currentUser, showToast } = useApp();

  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('General');
  const [commentTextMap, setCommentTextMap] = useState<{ [postId: string]: string }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    addPost(postContent, undefined, postCategory);
    setPostContent('');
  };

  const handleSendComment = (postId: string) => {
    const text = commentTextMap[postId];
    if (!text || !text.trim()) return;
    addComment(postId, text);
    setCommentTextMap((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Main Feed (8 Columns) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Create Post Card (Admin Only) */}
        {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80'}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border border-amber-400"
              />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Publish Official Community Announcement</span>
                  <span className="bg-amber-500 text-amber-950 px-1.5 py-0.2 text-[9px] font-black rounded uppercase">Admin</span>
                </h3>
                <p className="text-[10px] text-slate-400">Broadcast news, temple events, or official notices to all Jains worldwide</p>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Jai Jinendra! Write your official update here..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex items-center justify-between gap-2 text-xs">
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs"
                >
                  <option value="General">General Post</option>
                  <option value="Temple">Temple & Tirth</option>
                  <option value="Event">Community Event</option>
                  <option value="News">Jain News</option>
                </select>

                <button
                  type="submit"
                  disabled={!postContent.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-md hover:from-amber-600 hover:to-amber-800 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Post</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-amber-950 text-amber-100 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-4 text-xs shadow-md">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold">Official Jain Community Bulletins</p>
                <p className="text-[11px] text-amber-200/80">Posts and news updates are broadcasted by Verified Super Admin. Feel free to like, comment, and share with your family.</p>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((p) => {
            const isLiked = currentUser && p.likedByUsers.includes(currentUser.id);

            return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.authorPhoto}
                      alt={p.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.authorName}</h4>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                        {p.authorRole} • {p.createdAt}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold rounded-full uppercase">
                    {p.category}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {p.content}
                </p>

                {/* Post Image */}
                {p.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-80">
                    <img src={p.imageUrl} alt="Post Attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Like & Share Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    onClick={() => likePost(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-bold ${
                      isLiked ? 'bg-amber-500 text-amber-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{p.likesCount} Likes</span>
                  </button>

                  <button
                    onClick={() => showToast('Post Shared', 'Link copied to share with WhatsApp.', 'info')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl space-y-2 text-xs">
                  {p.comments.map((c) => (
                    <div key={c.id} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-amber-600 dark:text-amber-400">{c.authorName}: </span>
                      <span className="text-slate-700 dark:text-slate-300">{c.text}</span>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentTextMap[p.id] || ''}
                      onChange={(e) =>
                        setCommentTextMap({ ...commentTextMap, [p.id]: e.target.value })
                      }
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                    <button
                      onClick={() => handleSendComment(p.id)}
                      className="px-3 py-1.5 bg-amber-600 text-white font-bold text-xs rounded-lg"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar News & Announcements (4 Columns) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Newspaper className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Global Jain News & Bulletins
            </h3>
          </div>

          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs"
              >
                {item.isPinned && (
                  <span className="px-2 py-0.5 bg-amber-500 text-amber-950 font-extrabold rounded text-[9px] uppercase inline-flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
                <h4 className="font-bold font-serif text-slate-900 dark:text-white text-sm">
                  {item.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{item.author}</span>
                  <span>{item.publishedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
