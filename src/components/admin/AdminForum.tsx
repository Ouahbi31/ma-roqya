import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Check, X, Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ForumPostAdmin {
  id: string;
  user_name: string;
  titre: string;
  contenu: string;
  categorie: string;
  statut: 'en_attente' | 'approuve' | 'rejete';
  replies_count: number;
  created_at: string;
}

type ViewTab = 'en_attente' | 'approuve' | 'rejete';

const TAB_CONFIG: { key: ViewTab; label: string; icon: typeof Clock; color: string }[] = [
  { key: 'en_attente', label: 'En attente', icon: Clock, color: 'text-amber-600' },
  { key: 'approuve', label: 'Approuvés', icon: CheckCircle, color: 'text-green-600' },
  { key: 'rejete', label: 'Rejetés', icon: XCircle, color: 'text-red-600' },
];

export default function AdminForum() {
  const [posts, setPosts] = useState<ForumPostAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ViewTab>('en_attente');

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPosts(data as ForumPostAdmin[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const updateStatut = async (id: string, statut: 'approuve' | 'rejete') => {
    const { error } = await supabase
      .from('forum_posts')
      .update({ statut })
      .eq('id', id);
    if (!error) {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, statut } : p))
      );
    }
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('forum_posts').delete().eq('id', id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filtered = posts.filter((p) => p.statut === activeTab);
  const pendingCount = posts.filter((p) => p.statut === 'en_attente').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-islamic" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="rounded-xl border border-cream-dark bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{pendingCount}</p>
            <p className="text-sm text-text-secondary">
              {pendingCount === 1 ? 'post en attente de modération' : 'posts en attente de modération'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {TAB_CONFIG.map(({ key, label, icon: Icon, color }) => {
          const count = posts.filter((p) => p.statut === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === key
                  ? 'bg-green-islamic text-white shadow-sm'
                  : 'border-2 border-green-islamic text-green-islamic hover:bg-green-islamic/5'
              }`}
            >
              <Icon size={16} className={activeTab === key ? 'text-white' : color} />
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Posts list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-cream-dark bg-white py-12 text-center">
            <MessageCircle size={32} className="mx-auto mb-2 text-cream-dark" />
            <p className="text-sm text-text-secondary">
              Aucun post {activeTab === 'en_attente' ? 'en attente' : activeTab === 'approuve' ? 'approuvé' : 'rejeté'}.
            </p>
          </div>
        ) : (
          filtered.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-cream-dark bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-islamic/10 px-3 py-1 text-xs font-medium text-green-islamic">
                  {post.categorie}
                </span>
                <span className="text-xs text-text-secondary">{post.user_name}</span>
                <span className="text-xs text-text-secondary">
                  &middot; {new Date(post.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <h3 className="mb-2 font-heading text-base font-semibold text-text-primary">
                {post.titre}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                {post.contenu}
              </p>

              <div className="flex flex-wrap gap-2">
                {activeTab === 'en_attente' && (
                  <>
                    <button
                      onClick={() => updateStatut(post.id, 'approuve')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      <Check size={14} /> Approuver
                    </button>
                    <button
                      onClick={() => updateStatut(post.id, 'rejete')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                      <X size={14} /> Rejeter
                    </button>
                  </>
                )}
                {activeTab === 'approuve' && (
                  <button
                    onClick={() => updateStatut(post.id, 'rejete')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                  >
                    <X size={14} /> Rejeter
                  </button>
                )}
                {activeTab === 'rejete' && (
                  <button
                    onClick={() => updateStatut(post.id, 'approuve')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
                  >
                    <Check size={14} /> Approuver
                  </button>
                )}
                <button
                  onClick={() => deletePost(post.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cream-dark px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-red-100 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
