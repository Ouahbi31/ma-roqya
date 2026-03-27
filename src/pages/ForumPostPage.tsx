import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { sampleForumPosts } from '../data/forumPosts';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

const sampleReplies = [
  {
    id: '1',
    user_name: 'Frère Youssef',
    contenu: "Qu'Allah te facilite. Continue tes adhkar quotidiens et n'hésite pas à consulter un raki de confiance. La patience est la clé, insha'Allah.",
    created_at: '2024-01-16',
  },
  {
    id: '2',
    user_name: 'Sœur Khadija',
    contenu: "Je suis passée par une épreuve similaire. La récitation régulière de la sourate Al-Baqara m'a beaucoup aidée. Qu'Allah t'accorde la guérison.",
    created_at: '2024-01-17',
  },
];

export default function ForumPostPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const post = sampleForumPosts.find((p) => p.id === id);
  const [replyText, setReplyText] = useState('');

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-text-primary">Sujet introuvable</h1>
          <Link to="/forum" className="mt-4 inline-block text-green-islamic hover:text-gold">
            ← {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/forum" className="mb-6 inline-flex items-center gap-2 text-sm text-green-islamic hover:text-gold">
          <ArrowLeft size={16} /> {t('common.back')}
        </Link>

        {/* Post */}
        <div className="card-islamic mb-6 p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">{post.user_name}</span>
            <span>· {new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          <h1 className="mb-4 font-heading text-2xl font-bold text-text-primary">{post.titre}</h1>
          <p className="whitespace-pre-line leading-relaxed text-text-primary">{post.contenu}</p>
        </div>

        <div className="arabesque-separator mb-6" />

        {/* Replies */}
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-text-primary">
          <MessageCircle size={18} className="text-green-islamic" />
          {sampleReplies.length} {t('forum.replies')}
        </h2>

        <div className="space-y-4">
          {sampleReplies.map((reply) => (
            <div key={reply.id} className="card-islamic p-5">
              <div className="mb-2 flex items-center gap-2 text-sm">
                <span className="font-medium text-text-primary">{reply.user_name}</span>
                <span className="text-text-secondary">· {new Date(reply.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <p className="text-text-primary">{reply.contenu}</p>
            </div>
          ))}
        </div>

        {/* Reply form */}
        {user ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setReplyText('');
            }}
            className="mt-6"
          >
            <textarea
              placeholder={t('forum.post_content')}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              className="mb-3 w-full rounded-lg border border-cream-dark bg-white px-4 py-3 text-text-primary outline-none focus:border-green-islamic"
            />
            <button type="submit" className="btn-primary text-sm">
              {t('forum.reply')}
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-xl bg-cream-dark p-4 text-center">
            <Link to="/login" className="font-medium text-green-islamic hover:text-gold">
              {t('forum.login_to_post')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
