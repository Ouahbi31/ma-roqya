import { useState, useEffect, useCallback } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Slot {
  id: string;
  jour: number;
  heure: string;
  actif: boolean;
}

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const JOURS_COURTS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
// Display order: Lun(1), Mar(2), Mer(3), Jeu(4), Ven(5), Sam(6), Dim(0)
const JOUR_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function AdminDisponibilites() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingDay, setAddingDay] = useState<number | null>(null);
  const [newHeure, setNewHeure] = useState('09:00');

  const fetchSlots = useCallback(async () => {
    const { data } = await supabase
      .from('disponibilites')
      .select('*')
      .order('heure');
    if (data) setSlots(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const addSlot = async (jour: number) => {
    setSaving(true);
    const { error } = await supabase
      .from('disponibilites')
      .insert({ jour, heure: newHeure, actif: true });

    if (error) {
      if (error.code === '23505') {
        alert('Ce créneau existe déjà');
      } else {
        alert('Erreur : ' + error.message);
      }
    } else {
      setAddingDay(null);
      setNewHeure('09:00');
      await fetchSlots();
    }
    setSaving(false);
  };

  const removeSlot = async (id: string) => {
    setSaving(true);
    await supabase.from('disponibilites').delete().eq('id', id);
    await fetchSlots();
    setSaving(false);
  };

  const toggleSlot = async (id: string, actif: boolean) => {
    setSaving(true);
    await supabase.from('disponibilites').update({ actif: !actif }).eq('id', id);
    await fetchSlots();
    setSaving(false);
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
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold text-green-islamic">
          Gérer vos disponibilités
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Ajoutez ou supprimez des créneaux. Les modifications sont immédiates sur la page de réservation.
        </p>
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {JOUR_ORDER.map((jour) => {
          const daySlots = slots
            .filter((s) => s.jour === jour)
            .sort((a, b) => a.heure.localeCompare(b.heure));

          return (
            <div
              key={jour}
              className="rounded-2xl border border-cream-dark bg-white/70 p-4"
            >
              <h3 className="mb-3 text-center font-heading text-sm font-bold text-green-islamic">
                <span className="hidden sm:inline">{JOURS[jour]}</span>
                <span className="sm:hidden">{JOURS_COURTS[jour]}</span>
              </h3>

              <div className="space-y-2">
                {daySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      slot.actif
                        ? 'bg-green-islamic/10 text-green-islamic'
                        : 'bg-gray-100 text-gray-400 line-through'
                    }`}
                  >
                    <button
                      onClick={() => toggleSlot(slot.id, slot.actif)}
                      className="font-medium hover:opacity-70"
                      title={slot.actif ? 'Désactiver' : 'Activer'}
                    >
                      {slot.heure}
                    </button>
                    <button
                      onClick={() => removeSlot(slot.id)}
                      className="rounded p-0.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                      disabled={saving}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {daySlots.length === 0 && (
                  <p className="py-2 text-center text-xs text-text-secondary italic">
                    Aucun créneau
                  </p>
                )}
              </div>

              {/* Add slot */}
              {addingDay === jour ? (
                <div className="mt-3 space-y-2">
                  <input
                    type="time"
                    value={newHeure}
                    onChange={(e) => setNewHeure(e.target.value)}
                    className="w-full rounded-lg border border-cream-dark bg-white px-3 py-1.5 text-sm"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => addSlot(jour)}
                      disabled={saving}
                      className="flex-1 rounded-lg bg-green-islamic px-2 py-1.5 text-xs font-medium text-white transition hover:bg-green-islamic/90"
                    >
                      {saving ? '...' : 'OK'}
                    </button>
                    <button
                      onClick={() => setAddingDay(null)}
                      className="rounded-lg border border-cream-dark px-2 py-1.5 text-xs text-text-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingDay(jour);
                    setNewHeure('09:00');
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed border-cream-dark py-2 text-xs text-text-secondary transition hover:border-green-islamic hover:text-green-islamic"
                >
                  <Plus size={14} />
                  Ajouter
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
