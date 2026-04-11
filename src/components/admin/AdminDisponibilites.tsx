import { useState, useEffect, useCallback } from 'react';
import { Plus, X, Loader2, Save, AlertCircle, Globe } from 'lucide-react';
import { adminGet, adminPatch } from '../../lib/admin-api';

// Cal.com utilise des noms de jours en anglais dans availability
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const JOURS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const JOURS_COURTS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
// Display order: Lun → Dim
const JOUR_ORDER = [1, 2, 3, 4, 5, 6, 0];

interface AvailabilityRule {
  days: string[];
  startTime: string; // "HH:MM"
  endTime: string;
}

interface CalSchedule {
  id: number;
  name: string;
  timeZone: string;
  isDefault: boolean;
  availability: AvailabilityRule[];
}

interface ScheduleResponse {
  schedules: CalSchedule[];
  defaultSchedule: CalSchedule | null;
}

// Range affichée par jour (extraite des rules)
interface DayRange {
  ruleIndex: number; // index dans availability
  startTime: string;
  endTime: string;
}

export default function AdminDisponibilites() {
  const [schedule, setSchedule] = useState<CalSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingDay, setAddingDay] = useState<number | null>(null);
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('10:00');

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGet<ScheduleResponse>('/api/admin/calcom-schedules');
      setSchedule(data.defaultSchedule);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  /** Convertit les rules Cal.com en ranges par jour pour affichage */
  function getRangesForDay(dayIdx: number): DayRange[] {
    if (!schedule) return [];
    const dayName = DAY_NAMES_EN[dayIdx];
    const ranges: DayRange[] = [];
    schedule.availability.forEach((rule, idx) => {
      if (rule.days.includes(dayName)) {
        ranges.push({ ruleIndex: idx, startTime: rule.startTime.slice(0, 5), endTime: rule.endTime.slice(0, 5) });
      }
    });
    return ranges.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  /** Sauvegarde le schedule mis à jour vers Cal.com */
  async function saveSchedule(updatedAvailability: AvailabilityRule[]) {
    if (!schedule) return;
    setSaving(true);
    setError(null);
    try {
      await adminPatch('/api/admin/calcom-schedules', {
        scheduleId: schedule.id,
        availability: updatedAvailability,
      });
      // Recharger pour avoir l'état exact retourné par Cal.com
      await fetchSchedule();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  /** Ajoute une plage horaire à un jour */
  async function addRange(dayIdx: number) {
    if (!schedule) return;
    if (newStart >= newEnd) {
      alert('L\'heure de fin doit être après l\'heure de début');
      return;
    }
    const dayName = DAY_NAMES_EN[dayIdx];
    // Tente de fusionner avec une rule existante qui a EXACTEMENT le même horaire
    const existingRuleIdx = schedule.availability.findIndex(
      (r) => r.startTime.slice(0, 5) === newStart && r.endTime.slice(0, 5) === newEnd && !r.days.includes(dayName)
    );
    let updated: AvailabilityRule[];
    if (existingRuleIdx >= 0) {
      updated = schedule.availability.map((r, i) =>
        i === existingRuleIdx ? { ...r, days: [...r.days, dayName] } : r
      );
    } else {
      updated = [...schedule.availability, { days: [dayName], startTime: newStart, endTime: newEnd }];
    }
    setAddingDay(null);
    await saveSchedule(updated);
  }

  /** Supprime une plage horaire d'un jour spécifique */
  async function removeRange(dayIdx: number, ruleIndex: number) {
    if (!schedule) return;
    const dayName = DAY_NAMES_EN[dayIdx];
    const updated = schedule.availability
      .map((r, i) => {
        if (i !== ruleIndex) return r;
        return { ...r, days: r.days.filter((d) => d !== dayName) };
      })
      .filter((r) => r.days.length > 0);
    await saveSchedule(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-islamic" />
      </div>
    );
  }

  if (error && !schedule) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
        <p className="mt-2 font-semibold text-red-700">Erreur de chargement</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        <button
          onClick={fetchSchedule}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!schedule) return null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold text-green-islamic">Mes disponibilités Cal.com</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Synchronisé en direct avec ton compte Cal.com. Chaque modification est appliquée immédiatement.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-islamic/5 px-3 py-1.5 text-xs text-green-islamic">
          <Globe className="h-3.5 w-3.5" />
          <span className="font-semibold">{schedule.name}</span> · {schedule.timeZone}
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {saving && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs text-blue-700">
          <Loader2 className="h-3 w-3 animate-spin" />
          Sauvegarde...
        </div>
      )}

      {/* Grid of days */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {JOUR_ORDER.map((dayIdx) => {
          const ranges = getRangesForDay(dayIdx);
          return (
            <div key={dayIdx} className="rounded-2xl border border-cream-dark bg-white/70 p-4">
              <h3 className="mb-3 text-center font-heading text-sm font-bold text-green-islamic">
                <span className="hidden sm:inline">{JOURS_FR[dayIdx]}</span>
                <span className="sm:hidden">{JOURS_COURTS[dayIdx]}</span>
              </h3>

              <div className="space-y-2">
                {ranges.map((range, i) => (
                  <div
                    key={`${range.ruleIndex}-${i}`}
                    className="flex items-center justify-between rounded-lg bg-green-islamic/10 px-3 py-2 text-xs text-green-islamic"
                  >
                    <span className="font-medium">
                      {range.startTime} – {range.endTime}
                    </span>
                    <button
                      onClick={() => removeRange(dayIdx, range.ruleIndex)}
                      className="rounded p-0.5 text-red-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      disabled={saving}
                      title="Supprimer ce créneau"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {ranges.length === 0 && (
                  <p className="py-2 text-center text-xs text-text-secondary italic">Indisponible</p>
                )}
              </div>

              {addingDay === dayIdx ? (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    <input
                      type="time"
                      value={newStart}
                      onChange={(e) => setNewStart(e.target.value)}
                      className="flex-1 rounded-lg border border-cream-dark bg-white px-2 py-1 text-xs"
                    />
                    <input
                      type="time"
                      value={newEnd}
                      onChange={(e) => setNewEnd(e.target.value)}
                      className="flex-1 rounded-lg border border-cream-dark bg-white px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => addRange(dayIdx)}
                      disabled={saving}
                      className="flex-1 rounded-lg bg-green-islamic px-2 py-1.5 text-xs font-medium text-white transition hover:bg-green-islamic/90 disabled:opacity-50"
                    >
                      {saving ? '...' : <Save className="mx-auto h-3 w-3" />}
                    </button>
                    <button
                      onClick={() => setAddingDay(null)}
                      className="rounded-lg border border-cream-dark px-2 py-1.5 text-xs text-text-secondary"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingDay(dayIdx);
                    setNewStart('09:00');
                    setNewEnd('10:00');
                  }}
                  disabled={saving}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed border-cream-dark py-2 text-xs text-text-secondary transition hover:border-green-islamic hover:text-green-islamic disabled:opacity-50"
                >
                  <Plus size={14} />
                  Ajouter
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-text-secondary">
        💡 Les modifications sont synchronisées avec Cal.com et s'appliquent immédiatement à tes liens de réservation publics.
      </p>
    </div>
  );
}
