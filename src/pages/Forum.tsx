import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MessageCircle, Plus, Info, Loader2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import AuthModal from '../components/auth/AuthModal';

interface ForumPost {
  id: string;
  user_name: string;
  titre: string;
  contenu: string;
  categorie: string;
  replies_count: number;
  created_at: string;
}

const categoryList = ['testimonials', 'questions', 'help', 'douas'] as const;

const categoryColors: Record<string, string> = {
  testimonials: 'bg-green-islamic/10 text-green-islamic',
  questions: 'bg-blue-100 text-blue-700',
  help: 'bg-gold/10 text-gold',
  douas: 'bg-purple-100 text-purple-700',
};

// Anti-spam: detect links, phone numbers, emails, social media references
function isSpam(text: string): boolean {
  const lower = text.toLowerCase();
  const spamKeywords = [
    'http', 'https', 'www', '.com', '.fr', '.net', '.org',
    'instagram', 'facebook', 'snapchat', 'tiktok', 'whatsapp', 'telegram',
  ];
  if (spamKeywords.some((kw) => lower.includes(kw))) return true;
  // Phone numbers: 10 consecutive digits or French format
  if (/\b\d{10}\b/.test(text)) return true;
  if (/\b0\d[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/.test(text)) return true;
  // Email addresses
  if (/@/.test(text)) return true;
  return false;
}

export default function Forum() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategorie, setNewCategorie] = useState<string>('questions');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('statut', 'approuve')
      .order('created_at', { ascending: false });
    if (data) setPosts(data as ForumPost[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filtered = activeCategory === 'all'
    ? posts
    : posts.filter((p) => p.categorie === activeCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newTitle.trim() || !newContent.trim()) {
      setFormError('Le titre et le contenu sont requis.');
      return;
    }

    // Anti-spam check
    if (isSpam(newTitle) || isSpam(newContent)) {
      setFormError('Les liens, numéros de téléphone, emails et réseaux sociaux ne sont pas autorisés.');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('forum_posts').insert({
      user_id: user?.id,
      user_name: user?.user_metadata?.prenom || user?.email?.split('@')[0] || 'Anonyme',
      titre: newTitle.trim(),
      contenu: newContent.trim(),
      categorie: newCategorie,
      statut: 'en_attente',
      replies_count: 0,
    });

    if (error) {
      setFormError(error.message);
    } else {
      setFormSuccess('Votre message a été envoyé et sera visible après validation par un modérateur.');
      setNewTitle('');
      setNewContent('');
      setShowNewPost(false);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <SEO
        title="Forum communautaire - Entraide Roqya & Guerison"
        description="Rejoignez notre communaute bienveillante pour echanger, temoigner et s'entraider dans le parcours de roqya et de guerison spirituelle."
        keywords="forum roqya, communaute islam guerison, temoignage roqya, entraide spirituelle, questions roqya"
        url="/forum"
      />
      <div className="mx-auto max-w-4xl">
        <Link to="/#ressources" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-islamic hover:underline">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="font-heading text-3xl font-bold text-green-islamic sm:text-4xl">
            {t('forum.title')}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">{t('forum.subtitle')}</p>
        </div>

        {/* Rules */}
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-cream-dark p-4">
          <Info size={20} className="mt-0.5 shrink-0 text-green-islamic" />
          <p className="text-sm text-text-secondary">{t('forum.rules')}</p>
        </div>

        {/* Success message */}
        {formSuccess && (
          <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            {formSuccess}
          </div>
        )}

        {/* Category tabs + New post */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === 'all' ? 'bg-green-islamic text-white' : 'bg-cream-dark text-text-secondary hover:bg-green-islamic/10'
              }`}
            >
              Tous
            </button>
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat ? 'bg-green-islamic text-white' : 'bg-cream-dark text-text-secondary hover:bg-green-islamic/10'
                }`}
              >
                {t(`forum.categories.${cat}`)}
              </button>
            ))}
          </div>

          {user ? (
            <button onClick={() => setShowNewPost(!showNewPost)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} /> {t('forum.new_post')}
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> {t('forum.new_post')}
            </button>
          )}
        </div>

        {/* New post form */}
        {showNewPost && (
          <form onSubmit={handleSubmit} className="card-islamic mb-6 p-6">
            <input
              type="text"
              placeholder={t('forum.post_title')}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-3 w-full rounded-lg border border-cream-dark bg-cream px-4 py-3 text-base text-text-primary outline-none focus:border-green-islamic"
            />
            <textarea
              placeholder={t('forum.post_content')}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              className="mb-3 w-full rounded-lg border border-cream-dark bg-cream px-4 py-3 text-base text-text-primary outline-none focus:border-green-islamic"
            />
            <select
              value={newCategorie}
              onChange={(e) => setNewCategorie(e.target.value)}
              className="mb-3 w-full rounded-lg border border-cream-dark bg-cream px-4 py-3 text-base text-text-primary outline-none focus:border-green-islamic"
            >
              {categoryList.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`forum.categories.${cat}`)}
                </option>
              ))}
            </select>

            {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}

            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 text-sm">
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {t('forum.post_submit')}
            </button>
          </form>
        )}

        {/* Posts list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-islamic" />
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <MessageCircle size={32} className="mx-auto mb-2 text-cream-dark" />
                <p className="text-sm text-text-secondary">Aucun post pour le moment.</p>
              </div>
            ) : (
              filtered.map((post) => (
                <Link
                  key={post.id}
                  to={`/forum/${post.id}`}
                  className="card-islamic block p-5 transition-transform hover:-translate-y-0.5"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[post.categorie] || 'bg-cream-dark text-text-secondary'}`}>
                      {t(`forum.categories.${post.categorie}`)}
                    </span>
                    <span className="text-xs text-text-secondary">{post.user_name}</span>
                    <span className="text-xs text-text-secondary">· {new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">{post.titre}</h3>
                  <p className="line-clamp-2 text-sm text-text-secondary">{post.contenu}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-text-secondary">
                    <MessageCircle size={14} /> {post.replies_count} {t('forum.replies')}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="participer à la discussion"
      />
    </div>
  );
}
