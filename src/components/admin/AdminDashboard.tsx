import { useEffect, useState } from 'react';
import {
  Loader2,
  TrendingUp,
  Wallet,
  Calendar,
  Users as UsersIcon,
  Crown,
  Bell,
  Mail,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { adminGet } from '../../lib/admin-api';

interface RevenuePoint {
  date: string;
  amount: number;
}

interface UpcomingBooking {
  id: number;
  uid: string;
  startTime: string;
  attendeeName?: string;
  attendeeEmail?: string;
  status: string;
  paid: boolean;
  eventTitle?: string;
}

interface DashboardStats {
  stripe: {
    grossRevenue30d: number;
    chargesCount30d: number;
    pendingBalance: number;
    availableBalance: number;
    revenueSeries: RevenuePoint[];
  };
  calcom: {
    upcomingCount: number;
    nextBooking: (UpcomingBooking & { meetingUrl?: string }) | null;
    upcomingBookings: UpcomingBooking[];
  };
  users: { total: number; premium: number; newLast7d: number };
  waitlist: { total: number };
  messages: { unread: number };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const mois = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
  return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGet<DashboardStats>('/api/admin/dashboard-stats');
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-islamic" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">Erreur de chargement</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        <button
          onClick={load}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </button>
      </div>
    );
  }

  if (!stats) return null;

  // Compute max for chart scaling
  const maxRevenue = Math.max(...stats.stripe.revenueSeries.map((p) => p.amount), 1);

  return (
    <div className="space-y-6">
      {/* Header avec refresh */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-green-islamic">Tableau de bord</h2>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-green-islamic/30 bg-white px-3 py-1.5 text-xs font-semibold text-green-islamic transition hover:bg-green-islamic/5 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Stats principales — 4 cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Revenus 30j */}
        <div className="rounded-2xl border border-green-islamic/20 bg-gradient-to-br from-green-islamic/5 to-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-green-islamic/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-green-islamic" />
            </div>
            <span className="text-xs font-semibold text-text-secondary">30 jours</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-text-primary">{formatEur(stats.stripe.grossRevenue30d)}</p>
          <p className="mt-1 text-xs text-text-secondary">
            {stats.stripe.chargesCount30d} paiement{stats.stripe.chargesCount30d > 1 ? 's' : ''}
          </p>
        </div>

        {/* Solde Stripe */}
        <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-gold/10 p-2.5">
              <Wallet className="h-5 w-5 text-gold" />
            </div>
            <span className="text-xs font-semibold text-text-secondary">Stripe</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-text-primary">{formatEur(stats.stripe.pendingBalance + stats.stripe.availableBalance)}</p>
          <p className="mt-1 text-xs text-text-secondary">
            {formatEur(stats.stripe.availableBalance)} dispo · {formatEur(stats.stripe.pendingBalance)} en attente
          </p>
        </div>

        {/* RDV à venir */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-blue-100 p-2.5">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-text-secondary">Cal.com</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-text-primary">{stats.calcom.upcomingCount}</p>
          <p className="mt-1 text-xs text-text-secondary">RDV à venir</p>
        </div>

        {/* Utilisateurs */}
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-purple-100 p-2.5">
              <UsersIcon className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-text-secondary">Inscrits</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-text-primary">{stats.users.total}</p>
          <p className="mt-1 text-xs text-text-secondary">+{stats.users.newLast7d} cette semaine</p>
        </div>
      </div>

      {/* Graphique revenus + Prochain RDV */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Graphique revenus 30j */}
        <div className="rounded-2xl border border-cream-dark bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Revenus des 30 derniers jours
          </h3>
          <div className="flex h-40 items-end gap-1">
            {stats.stripe.revenueSeries.map((point) => {
              const heightPct = (point.amount / maxRevenue) * 100;
              return (
                <div
                  key={point.date}
                  className="group relative flex-1 rounded-t bg-green-islamic/20 transition hover:bg-green-islamic/40"
                  style={{ height: `${Math.max(heightPct, 2)}%` }}
                  title={`${point.date} · ${formatEur(point.amount)}`}
                >
                  {point.amount > 0 && (
                    <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-text-primary px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                      {formatEur(point.amount)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-text-secondary">
            <span>il y a 30 j</span>
            <span>aujourd'hui</span>
          </div>
        </div>

        {/* Prochain RDV */}
        <div className="rounded-2xl border border-cream-dark bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Prochain rendez-vous
          </h3>
          {stats.calcom.nextBooking ? (
            <div>
              <p className="font-semibold text-text-primary">{stats.calcom.nextBooking.attendeeName || 'Client'}</p>
              <p className="text-xs text-text-secondary">{stats.calcom.nextBooking.attendeeEmail}</p>
              <p className="mt-3 text-sm font-medium text-green-islamic">
                {formatDate(stats.calcom.nextBooking.startTime)}
              </p>
              <p className="mt-1 text-xs text-text-secondary">{stats.calcom.nextBooking.eventTitle}</p>
              {stats.calcom.nextBooking.meetingUrl && (
                <a
                  href={stats.calcom.nextBooking.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-green-islamic px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-islamic/90"
                >
                  <ExternalLink className="h-3 w-3" />
                  Rejoindre
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">Aucun RDV à venir.</p>
          )}
        </div>
      </div>

      {/* Liste des prochains RDV */}
      {stats.calcom.upcomingBookings.length > 0 && (
        <div className="rounded-2xl border border-cream-dark bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
            5 prochains rendez-vous Cal.com
          </h3>
          <div className="space-y-2">
            {stats.calcom.upcomingBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-cream-dark/40 bg-cream-dark/10 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text-primary">{b.attendeeName || 'Client'}</p>
                  <p className="truncate text-xs text-text-secondary">{b.eventTitle}</p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-semibold text-green-islamic">{formatDate(b.startTime)}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      b.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {b.paid ? 'Payé' : b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mini stats secondaires */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Premium */}
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gold/20 p-2">
              <Crown className="h-4 w-4 text-gold" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">{stats.users.premium}</p>
              <p className="text-xs text-text-secondary">Abonnés Premium</p>
            </div>
          </div>
        </div>

        {/* Waitlist */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">{stats.waitlist.total}</p>
              <p className="text-xs text-text-secondary">En liste d'attente</p>
            </div>
          </div>
        </div>

        {/* Messages non lus */}
        <div className={`rounded-xl border p-4 ${stats.messages.unread > 0 ? 'border-red-200 bg-red-50' : 'border-cream-dark bg-white'}`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${stats.messages.unread > 0 ? 'bg-red-100' : 'bg-cream-dark/40'}`}>
              <Mail className={`h-4 w-4 ${stats.messages.unread > 0 ? 'text-red-600' : 'text-text-secondary'}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">{stats.messages.unread}</p>
              <p className="text-xs text-text-secondary">Message{stats.messages.unread > 1 ? 's' : ''} non lu{stats.messages.unread > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
