import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

interface VideoItem {
  id: string;
  title: string;
  youtube_id: string;
  created_at: string;
}

export default function Videos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setVideos(data as VideoItem[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <SEO title="Vidéos — MaRoqya" description="Vidéos éducatives sur la roqya, la psycho-roqya et le bien-être spirituel." />

      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Link to="/#ressources" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-islamic hover:underline">
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>
          <h1 className="font-heading text-3xl font-bold text-green-islamic sm:text-4xl">
            Vidéos
          </h1>
          <p className="mt-2 text-text-secondary">
            Contenus éducatifs sur la roqya, la psycho-roqya et le bien-être spirituel
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-green-islamic" />
            </div>
          ) : videos.length === 0 ? (
            <p className="py-16 text-center text-text-secondary">
              Aucune vidéo pour le moment. Revenez bientôt !
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {videos.map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border border-cream-dark bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`}
                      alt={v.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow transition-transform group-hover:scale-110">
                        <Play size={22} className="text-green-islamic ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-base font-bold text-text-primary group-hover:text-green-islamic">
                      {v.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
