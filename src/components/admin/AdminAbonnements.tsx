import { useState, useEffect, useCallback } from 'react';
import { Crown, User, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PremiumUser {
  id: string;
  prenom: string | null;
  email: string | null;
  created_at: string;
}

export default function AdminAbonnements() {
  const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPremiumUsers = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, prenom, email, created_at')
      .eq('is_premium', true)
      .order('created_at', { ascending: false });

    if (data) setPremiumUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPremiumUsers();
  }, [fetchPremiumUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-green-islamic" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-cream-dark bg-white/70 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
              <Crown className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{premiumUsers.length}</p>
              <p className="text-sm text-text-secondary">Abonnés Premium</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium users list */}
      <div className="rounded-2xl border border-cream-dark bg-white/70 shadow-sm">
        <div className="border-b border-cream-dark px-5 py-4">
          <h3 className="font-heading text-lg font-semibold text-text-primary">
            Utilisateurs Premium
          </h3>
        </div>

        {premiumUsers.length === 0 ? (
          <div className="px-5 py-10 text-center text-text-secondary">
            Aucun abonné Premium pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-cream-dark">
            {premiumUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-islamic/10">
                  <User className="h-5 w-5 text-green-islamic" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary">
                    {u.prenom || 'Sans nom'}
                  </p>
                  <p className="truncate text-sm text-text-secondary">
                    {u.email || 'Pas d\'email'}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    <Crown size={12} />
                    Premium
                  </span>
                </div>
                <div className="hidden shrink-0 text-right text-xs text-text-secondary sm:block">
                  Inscrit le{' '}
                  {new Date(u.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
