import { useEffect, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Reservation {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  notes: string | null;
  date_reservation: string;
  heure: string;
  montant: number;
  statut: string;
  type_seance: string | null;
  created_at: string;
}

const STATUT_COLORS: Record<string, string> = {
  payee: 'bg-green-100 text-green-800',
  en_attente: 'bg-yellow-100 text-yellow-800',
  annulee: 'bg-red-100 text-red-800',
  remboursee: 'bg-gray-100 text-gray-800',
};

const STATUT_LABELS: Record<string, string> = {
  payee: 'Payée ✅',
  en_attente: 'En attente ⏳',
  annulee: 'Annulée ❌',
  remboursee: 'Remboursée 💸',
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date_reservation', { ascending: true })
      .order('heure', { ascending: true });

    if (!error && data) setReservations(data);
    setLoading(false);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const mois = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
    return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]}`;
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (list: Reservation[]) => {
    const allSelected = list.every((r) => selected.has(r.id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        list.forEach((r) => next.delete(r.id));
      } else {
        list.forEach((r) => next.add(r.id));
      }
      return next;
    });
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Supprimer ${selected.size} réservation(s) ? Cette action est irréversible.`)) return;
    setDeleting(true);
    const ids = Array.from(selected);
    const { error } = await supabase.from('reservations').delete().in('id', ids);
    if (error) {
      alert(`Erreur lors de la suppression : ${error.message}`);
    } else {
      setSelected(new Set());
      await fetchReservations();
    }
    setDeleting(false);
  };

  const upcoming = reservations.filter(
    (r) => r.statut === 'payee' && new Date(r.date_reservation) >= new Date(new Date().toDateString())
  );
  const past = reservations.filter(
    (r) => r.statut === 'payee' && new Date(r.date_reservation) < new Date(new Date().toDateString())
  );
  const pending = reservations.filter((r) => r.statut === 'en_attente');

  if (loading) {
    return <div className="py-12 text-center text-text-secondary">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-xl font-bold text-green-islamic">Réservations</h2>
          <span className="rounded-full bg-green-islamic/10 px-3 py-1 text-xs font-semibold text-green-islamic">
            {upcoming.length} à venir
          </span>
        </div>
        {selected.size > 0 && (
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Supprimer ({selected.size})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-green-islamic/5 border border-green-islamic/15 p-4 text-center">
          <p className="text-2xl font-bold text-green-islamic">{upcoming.length}</p>
          <p className="text-xs text-text-secondary">À venir</p>
        </div>
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{pending.length}</p>
          <p className="text-xs text-text-secondary">En attente</p>
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{past.length}</p>
          <p className="text-xs text-text-secondary">Passées</p>
        </div>
        <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 text-center">
          <p className="text-2xl font-bold text-gold">
            {reservations.filter((r) => r.statut === 'payee').reduce((sum, r) => sum + r.montant, 0) / 100}€
          </p>
          <p className="text-xs text-text-secondary">Revenus total</p>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <Section
          title="Paiements en attente"
          list={pending}
          selected={selected}
          onToggle={toggleSelect}
          onToggleAll={() => toggleSelectAll(pending)}
          formatDate={formatDate}
        />
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Section
          title="Séances à venir"
          list={upcoming}
          selected={selected}
          onToggle={toggleSelect}
          onToggleAll={() => toggleSelectAll(upcoming)}
          formatDate={formatDate}
        />
      )}

      {/* Past */}
      {past.length > 0 && (
        <Section
          title="Séances passées"
          list={past}
          selected={selected}
          onToggle={toggleSelect}
          onToggleAll={() => toggleSelectAll(past)}
          formatDate={formatDate}
        />
      )}

      {reservations.length === 0 && (
        <div className="rounded-xl bg-cream-dark/30 py-12 text-center">
          <p className="text-lg font-medium text-text-secondary">Aucune réservation pour le moment</p>
          <p className="mt-1 text-sm text-text-secondary">
            Les réservations apparaîtront ici dès qu'un client aura payé.
          </p>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  list,
  selected,
  onToggle,
  onToggleAll,
  formatDate,
}: {
  title: string;
  list: Reservation[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  formatDate: (d: string) => string;
}) {
  const allSelected = list.length > 0 && list.every((r) => selected.has(r.id));
  const someSelected = list.some((r) => selected.has(r.id));

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
          onChange={onToggleAll}
          className="rounded"
          title="Tout sélectionner"
        />
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-3">
        {list.map((r) => (
          <ReservationCard
            key={r.id}
            reservation={r}
            isSelected={selected.has(r.id)}
            onToggle={() => onToggle(r.id)}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
}

function ReservationCard({
  reservation: r,
  isSelected,
  onToggle,
  formatDate,
}: {
  reservation: Reservation;
  isSelected: boolean;
  onToggle: () => void;
  formatDate: (d: string) => string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm transition ${
        isSelected ? 'border-red-300 bg-red-50' : 'border-cream-dark bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="mt-1 rounded"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-text-primary">{r.nom}</p>
              <p className="text-sm text-text-secondary">{r.email}</p>
              {r.telephone && <p className="text-sm text-text-secondary">📞 {r.telephone}</p>}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUT_COLORS[r.statut] || 'bg-gray-100'}`}>
              {STATUT_LABELS[r.statut] || r.statut}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            <span>📅 {formatDate(r.date_reservation)}</span>
            <span>🕐 {r.heure}</span>
            <span>💰 {r.montant ? r.montant / 100 : '—'}€</span>
            {r.type_seance && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                r.type_seance === 'couple'
                  ? 'bg-gold/10 text-yellow-700'
                  : 'bg-green-islamic/10 text-green-800'
              }`}>
                {r.type_seance === 'couple' ? '👫 Couple' : '👤 Individuel'}
              </span>
            )}
          </div>
          {r.notes && (
            <div className="mt-3 rounded-lg bg-cream-dark/20 p-3 text-sm text-text-secondary">
              <span className="font-medium">Notes :</span> {r.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
