import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MessageCircle, Plus, Info } from 'lucide-react';
import { sampleForumPosts } from '../data/forumPosts';
import { useAuthStore } from '../store/authStore';
import type { ForumPost } from '../data/forumPosts';
import SEO from '../components/SEO';

const categoryList = ['testimonials', 'questions', 'help', 'douas'] as const;

const categoryColors: Record<string, string> = {
  testimonials: 'bg-green-islamic/10 text-green-islamic',
  questions: 'bg-blue-100 text-blue-700',
  help: 'bg-gold/10 text-gold',
  douas: 'bg-purple-100 text-purple-700',
};

export default function Forum() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const filtered = activeCategory === 'all'
    ? sampleForumPosts
    : sampleForumPosts.filter((p: ForumPost) => p.categorie === activeCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNewPost(false);
    setNewTitle('');
    setNewContent('');
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
            <Link to="/login" className="text-sm font-medium text-green-islamic hover:text-gold">
              {t('forum.login_to_post')}
            </Link>
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
              className="mb-3 w-full rounded-lg border border-cream-dark bg-cream px-4 py-2 text-text-primary outline-none focus:border-green-islamic"
            />
            <textarea
              placeholder={t('forum.post_content')}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              className="mb-3 w-full rounded-lg border border-cream-dark bg-cream px-4 py-2 text-text-primary outline-none focus:border-green-islamic"
            />
            <button type="submit" className="btn-primary text-sm">
              {t('forum.post_submit')}
            </button>
          </form>
        )}

        {/* Posts list */}
        <div className="space-y-4">
          {filtered.map((post) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
