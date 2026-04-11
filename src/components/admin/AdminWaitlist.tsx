import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { adminFetch } from '../../lib/admin-api';
import { Bell, Download, Send, Loader2, ChevronDown, Trash2 } from 'lucide-react';

interface WaitlistEntry {
  id: string;
  email: string;
  programme_slug: string;
  position: number;
  discount_percent: number;
  notified: boolean;
  created_at: string;
}

const PROGRAMME_NAMES: Record<string, string> = {
  'reprendre-confiance':  'Reprendre confiance en soi',
  'gestion-conflits':     'Gérer les conflits dans le couple',
  'preparer-mariage':     'Préparer son mariage',
  'transformation-nefs':  'Transformation Nefs — 30 jours',
  'education-enfants':    'Relation parents-enfants',
  'sexualite-islam':      'Sexualité en Islam',
};

const DISCOUNT_COLORS: Record<number, string> = {
  50: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  30: 'bg-blue-100 text-blue-800 border border-blue-300',
  0:  'bg-gray-100 text-gray-600 border border-gray-200',
};

export default function AdminWaitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSlug, setFilterSlug] = useState<string>('all');
  const [sending, setSending] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('programme_slug')
      .order('position');
    if (!error && data) setEntries(data);
    setLoading(false);
  };

  // Stats par programme
  const statsByProg = Object.entries(PROGRAMME_NAMES).map(([slug, name]) => {
    const list = entries.filter((e) => e.programme_slug === slug);
    return {
      slug,
      name,
      total: list.length,
      founders: list.filter((e) => e.discount_percent === 50).length,
      earlybird: list.filter((e) => e.discount_percent === 30).length,
      notified: list.filter((e) => e.notified).length,
    };
  }).filter((s) => s.total > 0);

  const filtered = filterSlug === 'all'
    ? entries
    : entries.filter((e) => e.programme_slug === filterSlug);

  // Export CSV
  const exportCSV = () => {
    const rows = [
      ['Email', 'Programme', 'Position', 'Remise (%)', 'Notifié', 'Date inscription'],
      ...filtered.map((e) => [
        e.email,
        PROGRAMME_NAMES[e.programme_slug] ?? e.programme_slug,
        e.position,
        e.discount_percent,
        e.notified ? 'Oui' : 'Non',
        new Date(e.created_at).toLocaleDateString('fr-FR'),
      ]),
    ];
    const csv = rows.map((r) => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-${filterSlug}-${Date.now()}.csv`;
    a.click();
  };

  // Envoyer email de lancement à tous les inscrits d'un programme
  const sendLaunchEmail = async (slug: string) => {
    const progName = PROGRAMME_NAMES[slug] ?? slug;
    if (!confirm(`Envoyer l'email de lancement pour "${progName}" à tous ses inscrits non notifiés ?`)) return;

    setSending(slug);
    setSendResult(null);

    const toNotify = entries.filter((e) => e.programme_slug === slug && !e.notified);
    if (toNotify.length === 0) {
      setSendResult(`Aucun inscrit non notifié pour ce programme.`);
      setSending(null);
      return;
    }

    let sent = 0;
    const errors: string[] = [];
    for (const entry of toNotify) {
      try {
        const response = await adminFetch('/api/send-email', {
          method: 'POST',
          body: JSON.stringify({
            to: entry.email,
            subject: `🎉 ${progName} est maintenant disponible !`,
            html: buildLaunchEmail(entry, progName),
          }),
        });
        if (response.ok) {
          await supabase.from('waitlist').update({ notified: true }).eq('id', entry.id);
          sent++;
        } else {
          const err = await response.json().catch(() => ({}));
          errors.push(`${entry.email}: ${err.error || response.status}`);
        }
      } catch (e: unknown) {
        errors.push(`${entry.email}: ${e instanceof Error ? e.message : 'erreur réseau'}`);
      }
    }

    if (errors.length > 0) {
      setSendResult(`⚠️ ${sent} envoyé(s), ${errors.length} erreur(s) : ${errors.join(' | ')}`);
    } else {
      setSendResult(`✅ ${sent} email(s) envoyé(s) pour "${progName}".`);
    }
    setSending(null);
    fetchWaitlist();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((e) => e.id)));
    }
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Supprimer ${selected.size} inscription(s) ? Cette action est irréversible.`)) return;
    setDeleting(true);
    const ids = Array.from(selected);
    const { error } = await supabase.from('waitlist').delete().in('id', ids);
    if (error) {
      alert(`Erreur lors de la suppression : ${error.message}`);
    } else {
      setSelected(new Set());
      await fetchWaitlist();
    }
    setDeleting(false);
  };

  const buildLaunchEmail = (entry: WaitlistEntry, progName: string) => {
    const discountBlock = entry.discount_percent > 0
      ? `<p style="font-size:15px;color:#3d3325;">En tant que membre de notre liste d'attente, vous bénéficiez d'une remise exclusive de <strong style="color:#c9a84c;">${entry.discount_percent}%</strong>. Utilisez le code <strong style="background:#f5f0e8;padding:2px 8px;border-radius:4px;font-family:monospace;">EARLY${entry.discount_percent}</strong> lors de votre achat.</p>`
      : '';
    return `<div style="font-family:Georgia,serif;max-width:560px;margin:auto;">
      <div style="background:#2d6a4f;padding:32px;text-align:center;border-radius:16px 16px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🎉 ${progName} est disponible !</h1>
      </div>
      <div style="background:#fff;padding:36px;border-radius:0 0 16px 16px;">
        <p style="font-size:15px;color:#3d3325;">As-salamu alaykum,</p>
        <p style="font-size:15px;color:#3d3325;">Le programme <strong>${progName}</strong> que vous attendiez est maintenant en ligne !</p>
        ${discountBlock}
        <div style="text-align:center;margin:32px 0;">
          <a href="https://coachmynefs.com/coaching/programmes/${entry.programme_slug}"
             style="background:#c9a84c;color:#fff;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;">
            Accéder au programme →
          </a>
        </div>
        <p style="font-size:13px;color:#b0a090;text-align:center;">Barakallahu fik 🌿 — CoachMyNefs</p>
      </div>
    </div>`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-green-islamic" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Statistiques par programme */}
      <div>
        <h2 className="font-heading text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-green-islamic" />
          Inscrits par programme
        </h2>
        {statsByProg.length === 0 ? (
          <p className="text-sm text-text-secondary">Aucune inscription pour l'instant.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsByProg.map((s) => (
              <div key={s.slug} className="card-islamic p-5 space-y-3">
                <p className="font-semibold text-sm text-text-primary leading-snug">{s.name}</p>
                <div className="flex gap-3 text-xs flex-wrap">
                  <span className="rounded-full bg-green-islamic/10 text-green-islamic border border-green-islamic/20 px-2.5 py-0.5 font-semibold">
                    {s.total} inscrits
                  </span>
                  {s.founders > 0 && (
                    <span className="rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 font-semibold">
                      🥇 {s.founders} fondateurs
                    </span>
                  )}
                  {s.earlybird > 0 && (
                    <span className="rounded-full bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 font-semibold">
                      🥈 {s.earlybird} early bird
                    </span>
                  )}
                  {s.notified > 0 && (
                    <span className="rounded-full bg-gray-100 text-gray-500 border border-gray-200 px-2.5 py-0.5">
                      {s.notified} notifiés
                    </span>
                  )}
                </div>
                <button
                  onClick={() => sendLaunchEmail(s.slug)}
                  disabled={sending === s.slug || s.total === s.notified}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-islamic px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending === s.slug
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Envoi…</>
                    : s.total === s.notified
                    ? '✅ Tous notifiés'
                    : <><Send className="h-3.5 w-3.5" /> Envoyer l'email de lancement</>
                  }
                </button>
              </div>
            ))}
          </div>
        )}
        {sendResult && (
          <p className="mt-3 text-sm font-medium text-green-islamic">{sendResult}</p>
        )}
      </div>

      {/* Liste détaillée */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-heading text-lg font-bold text-text-primary">
            Liste complète ({filtered.length} inscrits)
          </h2>
          <div className="flex gap-2 flex-wrap">
            {/* Supprimer sélection */}
            {selected.size > 0 && (
              <button
                onClick={deleteSelected}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Supprimer ({selected.size})
              </button>
            )}
            {/* Filtre */}
            <div className="relative">
              <select
                value={filterSlug}
                onChange={(e) => setFilterSlug(e.target.value)}
                className="appearance-none rounded-xl border border-cream-dark bg-white pl-4 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-green-islamic/30"
              >
                <option value="all">Tous les programmes</option>
                {Object.entries(PROGRAMME_NAMES).map(([slug, name]) => (
                  <option key={slug} value={slug}>{name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-text-secondary" />
            </div>
            {/* Export CSV */}
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-green-islamic/40 px-4 py-2 text-sm font-semibold text-green-islamic transition hover:bg-green-islamic/5 disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              Exporter CSV
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-text-secondary">Aucune inscription pour ce filtre.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-cream-dark">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-dark/60 text-left">
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">#</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Email</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Programme</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Remise</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Notifié</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={e.id} className={`border-t border-cream-dark/40 ${selected.has(e.id) ? 'bg-red-50' : i % 2 === 0 ? 'bg-white' : 'bg-cream/40'}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(e.id)}
                        onChange={() => toggleSelect(e.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">{e.position}</td>
                    <td className="px-4 py-3 text-text-primary font-medium">{e.email}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {PROGRAMME_NAMES[e.programme_slug] ?? e.programme_slug}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${DISCOUNT_COLORS[e.discount_percent] ?? DISCOUNT_COLORS[0]}`}>
                        {e.discount_percent > 0 ? `-${e.discount_percent}%` : 'Aucune'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {e.notified
                        ? <span className="text-green-islamic font-bold">✅</span>
                        : <span className="text-text-secondary">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
