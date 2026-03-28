import { useState, useEffect, useCallback } from 'react';
import { FileText, Trash2, Loader2, Pencil, X, Check, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sampleArticles, categoryMeta, type ArticleCategory } from '../../data/articles';

interface ArticleOverride {
  id: string;
  title: string | null;
  excerpt: string | null;
  category: string | null;
  deleted: boolean;
  updated_at: string;
}

export default function AdminArticles() {
  const [overrides, setOverrides] = useState<ArticleOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchOverrides = useCallback(async () => {
    const { data } = await supabase
      .from('article_overrides')
      .select('*');
    if (data) setOverrides(data as ArticleOverride[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOverrides();
  }, [fetchOverrides]);

  // Merge hardcoded articles with overrides
  const mergedArticles = sampleArticles.map((article) => {
    const override = overrides.find((o) => o.id === article.id);
    if (!override) return { ...article, deleted: false };
    return {
      ...article,
      title: override.title ?? article.title,
      excerpt: override.excerpt ?? article.excerpt,
      category: (override.category as ArticleCategory) ?? article.category,
      deleted: override.deleted,
    };
  });

  const activeArticles = mergedArticles.filter((a) => !a.deleted);
  const deletedArticles = mergedArticles.filter((a) => a.deleted);

  const startEdit = (article: typeof mergedArticles[0]) => {
    setEditingId(article.id);
    setEditTitle(article.title);
    setEditExcerpt(article.excerpt);
    setEditCategory(article.category);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditExcerpt('');
    setEditCategory('');
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    setSaving(true);

    const original = sampleArticles.find((a) => a.id === id);
    const overrideData: Partial<ArticleOverride> = {
      id,
      title: editTitle.trim() !== original?.title ? editTitle.trim() : null,
      excerpt: editExcerpt.trim() !== original?.excerpt ? editExcerpt.trim() : null,
      category: editCategory !== original?.category ? editCategory : null,
      deleted: false,
    };

    const { error } = await supabase
      .from('article_overrides')
      .upsert(overrideData, { onConflict: 'id' });

    if (!error) {
      await fetchOverrides();
      setEditingId(null);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('article_overrides')
      .upsert({ id, deleted: true }, { onConflict: 'id' });

    if (!error) {
      await fetchOverrides();
    }
    setSaving(false);
  };

  const handleRestore = async (id: string) => {
    setSaving(true);
    // Check if there are other overrides for this article
    const override = overrides.find((o) => o.id === id);
    const hasOtherOverrides = override && (override.title || override.excerpt || override.category);

    if (hasOtherOverrides) {
      // Keep other overrides, just undelete
      const { error } = await supabase
        .from('article_overrides')
        .update({ deleted: false })
        .eq('id', id);
      if (!error) await fetchOverrides();
    } else {
      // No other overrides, remove the row entirely
      const { error } = await supabase
        .from('article_overrides')
        .delete()
        .eq('id', id);
      if (!error) await fetchOverrides();
    }
    setSaving(false);
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-islamic" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active articles */}
      <div className="rounded-xl border border-cream-dark bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-green-islamic">
          <FileText size={20} /> Articles ({activeArticles.length})
        </h2>

        {activeArticles.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-secondary">
            Aucun article pour le moment.
          </p>
        ) : (
          <div className="space-y-3">
            {activeArticles.map((article) => {
              const meta = categoryMeta[article.category];
              const isEditing = editingId === article.id;
              const hasOverride = overrides.some((o) => o.id === article.id && !o.deleted);

              return (
                <div
                  key={article.id}
                  className="rounded-xl border border-cream-dark bg-cream p-4 transition-shadow hover:shadow-md"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-text-primary">
                          Titre
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full rounded-lg border border-cream-dark bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-green-islamic"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-text-primary">
                          Extrait
                        </label>
                        <textarea
                          value={editExcerpt}
                          onChange={(e) => setEditExcerpt(e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-cream-dark bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-green-islamic"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-text-primary">
                          Catégorie
                        </label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full rounded-lg border border-cream-dark bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-green-islamic"
                        >
                          {(Object.keys(categoryMeta) as ArticleCategory[]).map((cat) => (
                            <option key={cat} value={cat}>
                              {categoryMeta[cat].label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(article.id)}
                          disabled={saving}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-islamic px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-islamic/90 disabled:opacity-50"
                        >
                          {saving ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                          Enregistrer
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 rounded-lg border border-cream-dark px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-cream"
                        >
                          <X size={14} /> Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-text-primary line-clamp-1">
                            {article.title}
                          </h3>
                          {hasOverride && (
                            <span className="shrink-0 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium text-gold">
                              modifié
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-text-secondary line-clamp-1">
                          {article.excerpt}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${meta.bg} ${meta.color}`}
                          >
                            {meta.label}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {formatDate(article.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => startEdit(article)}
                          className="rounded-lg p-1.5 text-gold transition-colors hover:bg-gold/10"
                          title="Modifier"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={saving}
                          className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deleted articles */}
      {deletedArticles.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-red-600">
            <Trash2 size={20} /> Articles supprimés ({deletedArticles.length})
          </h2>
          <div className="space-y-3">
            {deletedArticles.map((article) => {
              const meta = categoryMeta[article.category];
              return (
                <div
                  key={article.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-cream-dark bg-cream/50 p-4 opacity-70"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-text-primary line-clamp-1 line-through">
                      {article.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${meta.bg} ${meta.color}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestore(article.id)}
                    disabled={saving}
                    className="inline-flex items-center gap-1 rounded-lg bg-green-islamic px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-islamic/90 disabled:opacity-50"
                    title="Restaurer"
                  >
                    <RotateCcw size={14} /> Restaurer
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
