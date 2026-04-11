import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Crown,
  CalendarPlus,
  Mail,
  Send,
  X,
  Loader2,
  Search,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminFetch } from '../../lib/admin-api';

interface Profile {
  id: string;
  prenom: string | null;
  email: string | null;
  is_premium: boolean;
  role: string | null;
  created_at: string;
}

interface EmailModal {
  open: boolean;
  toAll: boolean;
  toEmail: string | null;
  toName: string | null;
}

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<EmailModal>({
    open: false,
    toAll: false,
    toEmail: null,
    toName: null,
  });
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, prenom, email, is_premium, role, created_at')
      .order('created_at', { ascending: false });
    if (data) setUsers(data as Profile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalUsers = users.length;
  const premiumUsers = users.filter((u) => u.is_premium).length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = users.filter(
    (u) => new Date(u.created_at) >= oneWeekAgo
  ).length;

  const filteredUsers = users.filter((u) =>
    (u.prenom ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (toAll: boolean, email?: string, name?: string) => {
    setModal({
      open: true,
      toAll,
      toEmail: email ?? null,
      toName: name ?? null,
    });
    setSubject('');
    setMessage('');
    setSendResult(null);
  };

  const closeModal = () => {
    setModal({ open: false, toAll: false, toEmail: null, toName: null });
    setSubject('');
    setMessage('');
    setSendResult(null);
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    setSendResult(null);

    try {
      const body: Record<string, unknown> = {
        subject,
        html: `<div style="font-family:sans-serif;line-height:1.6">${message.replace(/\n/g, '<br/>')}</div>`,
      };

      if (modal.toAll) {
        body.toAll = true;
      } else {
        body.to = modal.toEmail;
      }

      const res = await adminFetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSendResult({ ok: true, text: 'Email envoyé avec succès !' });
      } else {
        const data = await res.json().catch(() => ({}));
        setSendResult({
          ok: false,
          text: (data as { error?: string }).error || "Erreur lors de l'envoi",
        });
      }
    } catch {
      setSendResult({ ok: false, text: 'Erreur réseau' });
    } finally {
      setSending(false);
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
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-green-islamic">
            Utilisateurs
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {totalUsers} utilisateur{totalUsers > 1 ? 's' : ''} inscrits
          </p>
        </div>
        <button
          onClick={() => openModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-green-islamic px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-islamic/90"
        >
          <Send size={16} />
          Email groupé
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-green-islamic/5 border border-green-islamic/15 p-4 text-center">
          <p className="text-2xl font-bold text-green-islamic">{totalUsers}</p>
          <p className="text-xs text-text-secondary">Total</p>
        </div>
        <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 text-center">
          <p className="text-2xl font-bold text-gold">{premiumUsers}</p>
          <p className="text-xs text-text-secondary">Premium</p>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{newThisWeek}</p>
          <p className="text-xs text-text-secondary">Nouveaux (7j)</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-cream-dark bg-cream pl-9 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-green-islamic"
          />
        </div>
      </div>

      {/* Users list */}
      {filteredUsers.length === 0 ? (
        <div className="py-20 text-center">
          <Users className="mx-auto h-12 w-12 text-cream-dark" />
          <p className="mt-4 text-text-secondary">Aucun utilisateur</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 rounded-2xl border border-cream-dark bg-white/70 p-4"
            >
              {/* Avatar placeholder */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-islamic/10 text-sm font-bold text-green-islamic">
                {(user.prenom ?? '?').charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-text-primary">
                    {user.prenom || 'Sans nom'}
                  </span>
                  {user.is_premium && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold">
                      <Crown size={10} />
                      Premium
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-text-secondary">
                  <span className="truncate">{user.email || '—'}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarPlus size={12} />
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() =>
                  openModal(
                    false,
                    user.email ?? undefined,
                    user.prenom ?? undefined
                  )
                }
                className="shrink-0 rounded-full border border-green-islamic/20 p-2 text-green-islamic transition hover:bg-green-islamic/5"
                title="Envoyer un email"
              >
                <Mail size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Email Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-green-islamic">
                {modal.toAll
                  ? 'Email groupé — tous les utilisateurs'
                  : `Email à ${modal.toName || modal.toEmail}`}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-full p-1 text-text-secondary hover:bg-cream"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  Sujet
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm focus:border-green-islamic focus:outline-none focus:ring-1 focus:ring-green-islamic"
                  placeholder="Objet de l'email..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm focus:border-green-islamic focus:outline-none focus:ring-1 focus:ring-green-islamic"
                  placeholder="Contenu de l'email..."
                />
              </div>

              {sendResult && (
                <p
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    sendResult.ok
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {sendResult.text}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="rounded-full border border-cream-dark px-5 py-2 text-sm font-medium text-text-secondary hover:bg-cream"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || !subject.trim() || !message.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-green-islamic px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-islamic/90 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
