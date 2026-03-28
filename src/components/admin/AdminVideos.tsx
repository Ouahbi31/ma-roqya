import { useState, useEffect, useCallback } from 'react';
import { Video, Trash2, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface VideoItem {
  id: string;
  title: string;
  youtube_id: string;
  category: string;
  created_at: string;
}

function extractYoutubeId(url: string): string | null {
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // youtube.com/shorts/ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  // raw ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchVideos = useCallback(async () => {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setVideos(data as VideoItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const youtubeId = extractYoutubeId(url);
    if (!youtubeId) {
      setError('URL YouTube invalide. Formats acceptés : youtube.com/watch?v=, youtu.be/, youtube.com/shorts/');
      return;
    }
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }

    setSaving(true);
    const { error: insertError } = await supabase.from('videos').insert({
      title: title.trim(),
      youtube_id: youtubeId,
    });

    if (insertError) {
      console.error('Insert error:', insertError);
      setError(insertError.message || 'Erreur lors de l\'ajout. Déconnectez-vous et reconnectez-vous.');
    } else {
      setSuccess('Vidéo ajoutée avec succès.');
      setUrl('');
      setTitle('');
      fetchVideos();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error: delError } = await supabase.from('videos').delete().eq('id', id);
    if (!delError) {
      setVideos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-islamic" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add video form */}
      <div className="rounded-xl border border-cream-dark bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-green-islamic">
          <Plus size={20} /> Ajouter une vidéo
        </h2>

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Titre de la vidéo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Introduction à la Roqya Shar'iyya"
              className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary outline-none focus:border-green-islamic"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              URL YouTube
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary outline-none focus:border-green-islamic"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-green-islamic px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-islamic/90 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Ajouter
          </button>
        </form>
      </div>

      {/* Videos list */}
      <div className="rounded-xl border border-cream-dark bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-green-islamic">
          <Video size={20} /> Vidéos ({videos.length})
        </h2>

        {videos.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-secondary">
            Aucune vidéo pour le moment.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group overflow-hidden rounded-xl border border-cream-dark bg-cream transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-video">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-start justify-between gap-2 p-3">
                  <p className="text-sm font-medium text-text-primary line-clamp-2">
                    {video.title}
                  </p>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="shrink-0 rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
