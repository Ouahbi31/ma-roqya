import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { User, Users, Clock, Lock, RotateCcw, Mail, Video, CheckCircle, ChevronLeft } from 'lucide-react';
import SEO from '../../components/SEO';
import { useAuthStore } from '../../store/authStore';

type TypeSeance = 'individuel' | 'couple';

const CRENEAUX = ['9h00', '10h00', '11h00', '14h00', '15h00', '16h00', '17h00', '18h00'];

const JOURS_SEMAINE = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const JOURS_COURT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

// Jours exclus : vendredi (5) et dimanche (0)
const JOURS_EXCLUS = [0, 5];

const PRIX: Record<TypeSeance, number> = {
  individuel: 50,
  couple: 65,
};

function formatDate(date: Date): string {
  return `${JOURS_SEMAINE[date.getDay()]} ${date.getDate()} ${MOIS[date.getMonth()]} ${date.getFullYear()}`;
}

function toISOLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export default function CoachingReserver() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === '1';
  const typeParam = searchParams.get('type');
  const fromBio = searchParams.get('from') === 'bio';
  const preselectedType: TypeSeance | null =
    typeParam === 'individuel' || typeParam === 'couple' ? typeParam : null;
  const { user } = useAuthStore();

  const [selectedService, setSelectedService] = useState<TypeSeance | null>(preselectedType);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHeure, setSelectedHeure] = useState<string | null>(null);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Générer les 28 prochains jours à partir de demain
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 1; i <= 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  // Trouver le premier jour de la semaine du premier jour du calendrier
  const firstDay = calendarDays[0];
  const firstDayOfWeek = firstDay.getDay(); // 0=dim, 1=lun, ...

  // Construire la grille : padding initial + jours
  const gridCells = useMemo(() => {
    const cells: (Date | null)[] = Array(firstDayOfWeek).fill(null);
    calendarDays.forEach((d) => cells.push(d));
    // Pad end to complete last row
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [calendarDays, firstDayOfWeek]);

  const isExcluded = (d: Date) => JOURS_EXCLUS.includes(d.getDay());

  const handleDateSelect = (d: Date) => {
    if (isExcluded(d)) return;
    setSelectedDate(d);
    setSelectedHeure(null);
  };

  const handleHeureSelect = (h: string) => {
    setSelectedHeure(h);
  };

  const isFormValid =
    selectedService &&
    selectedDate &&
    selectedHeure &&
    nom.trim() &&
    email.trim();

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError(null);

    try {
      const body = {
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone.trim() || undefined,
        notes: notes.trim() || undefined,
        date_reservation: toISOLocal(selectedDate!),
        heure: selectedHeure,
        type_seance: selectedService,
        user_id: user?.id || undefined,
      };

      const res = await fetch('/api/create-coaching-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Réserver une séance — CoachMyNefs"
        description="Réservez votre séance de coaching individuel ou de couple. Accompagnement personnalisé, confidentiel et ancré dans les valeurs islamiques."
        keywords="réserver séance coaching, coaching individuel, coaching couple, CoachMyNefs"
        url="/coaching/reserver"
      />

      {/* Bannière succès */}
      {success && (
        <div className="sticky top-0 z-40 flex items-center gap-3 bg-green-islamic px-4 py-3 text-white shadow-md">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            Votre réservation est confirmée ! Vous recevrez un email de confirmation dans quelques minutes.
          </p>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden py-10 sm:py-14 md:py-20">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-4 text-center">
          {/* Bouton retour — ligne séparée */}
          <div className="flex justify-center mb-5">
            <Link
              to={fromBio ? '/bio' : '/coaching/services'}
              className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-white px-4 py-2 text-sm font-semibold text-gold shadow-sm hover:bg-gold hover:text-white transition-all duration-150"
            >
              <ChevronLeft className="h-4 w-4" />
              {fromBio ? 'Retour' : 'Retour aux services'}
            </Link>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-green-islamic">
            Réservez votre séance
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
            Un accompagnement personnalisé, confidentiel et ancré dans les valeurs islamiques
          </p>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      <div className="mx-auto max-w-3xl px-5 sm:px-4 py-10 sm:py-14 space-y-10">

        {/* Étape 1 — Choix du type de séance */}
        {preselectedType ? (
          /* Version compacte quand pré-sélectionné via URL */
          <section>
            <div className="rounded-2xl border-2 border-gold/40 bg-gold/5 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
                  {preselectedType === 'individuel'
                    ? <User className="h-5 w-5 text-gold" />
                    : <Users className="h-5 w-5 text-gold" />
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gold" />
                    <span className="font-heading text-sm font-bold text-text-primary">
                      Coaching {preselectedType === 'couple' ? 'de couple' : 'individuel'}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    1h · {PRIX[preselectedType]}€
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { window.history.replaceState({}, '', '/coaching/reserver'); setSelectedService(null); }}
                className="text-xs text-text-secondary hover:text-gold underline transition-colors"
              >
                Changer
              </button>
            </div>
          </section>
        ) : (
          /* Version complète quand pas de pré-sélection */
          <section>
            <h2 className="font-heading text-xl font-bold text-green-islamic mb-5">
              1. Choisissez votre type de séance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Individuel */}
              <button
                type="button"
                onClick={() => setSelectedService('individuel')}
                className={`text-left rounded-2xl border-2 p-5 sm:p-6 transition-all duration-200 ${
                  selectedService === 'individuel'
                    ? 'border-gold bg-gold/5 shadow-md'
                    : 'border-cream-dark bg-white hover:border-gold/50 hover:shadow-sm'
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${
                  selectedService === 'individuel' ? 'bg-gold/15' : 'bg-green-islamic/10'
                }`}>
                  <User className={`h-6 w-6 ${selectedService === 'individuel' ? 'text-gold' : 'text-green-islamic'}`} />
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-heading text-base font-bold text-text-primary">Individuel</h3>
                  <span className="text-xs text-text-secondary">👤</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="text-xs text-text-secondary">1h</span>
                  <span className="font-heading text-lg font-bold text-gold ml-auto">50€</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Travaillez sur vos blocages, votre confiance et votre développement personnel.
                </p>
                {selectedService === 'individuel' && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-gold">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Sélectionné
                  </div>
                )}
              </button>

              {/* Couple */}
              <button
                type="button"
                onClick={() => setSelectedService('couple')}
                className={`text-left rounded-2xl border-2 p-5 sm:p-6 transition-all duration-200 ${
                  selectedService === 'couple'
                    ? 'border-gold bg-gold/5 shadow-md'
                    : 'border-cream-dark bg-white hover:border-gold/50 hover:shadow-sm'
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${
                  selectedService === 'couple' ? 'bg-gold/15' : 'bg-gold/10'
                }`}>
                  <Users className="h-6 w-6 text-gold" />
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-heading text-base font-bold text-text-primary">Couple</h3>
                  <span className="text-xs text-text-secondary">👫</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="text-xs text-text-secondary">1h</span>
                  <span className="font-heading text-lg font-bold text-gold ml-auto">65€</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Séance à deux pour retrouver l'harmonie et la communication dans votre relation.
                </p>
                {selectedService === 'couple' && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-gold">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Sélectionné
                  </div>
                )}
              </button>
            </div>
          </section>
        )}

        {/* Étape 2 — Calendrier */}
        {selectedService && (
          <section>
            <h2 className="font-heading text-xl font-bold text-green-islamic mb-2">
              {preselectedType ? '1.' : '2.'} Choisissez une date
            </h2>
            <p className="text-sm text-text-secondary mb-5">
              Disponible du lundi au samedi (hors vendredi et dimanche)
            </p>

            {/* En-têtes jours */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {JOURS_COURT.map((j) => (
                <div key={j} className="text-center text-[11px] font-semibold text-text-secondary py-1">
                  {j}
                </div>
              ))}
            </div>

            {/* Grille */}
            <div className="grid grid-cols-7 gap-1">
              {gridCells.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} />;
                }
                const excluded = isExcluded(day);
                const selected = selectedDate ? isSameDay(day, selectedDate) : false;

                return (
                  <button
                    key={toISOLocal(day)}
                    type="button"
                    disabled={excluded}
                    onClick={() => handleDateSelect(day)}
                    className={`
                      relative flex flex-col items-center justify-center rounded-xl py-2 text-xs font-medium transition-all duration-150
                      ${excluded
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                        : selected
                          ? 'bg-gold text-white shadow-md scale-105'
                          : 'bg-white text-text-primary hover:bg-gold/10 hover:text-gold border border-cream-dark'
                      }
                    `}
                  >
                    <span className="text-[10px] opacity-60">{JOURS_COURT[day.getDay()]}</span>
                    <span className="text-sm font-bold">{day.getDate()}</span>
                    <span className="text-[9px] opacity-60">{MOIS[day.getMonth()].slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Étape 3 — Créneaux horaires */}
        {selectedDate && (
          <section>
            <h2 className="font-heading text-xl font-bold text-green-islamic mb-2">
              {preselectedType ? '2.' : '3.'} Choisissez un créneau
            </h2>
            <p className="text-sm text-text-secondary mb-5">
              {formatDate(selectedDate)}
            </p>
            <div className="flex flex-wrap gap-2">
              {CRENEAUX.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleHeureSelect(h)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                    selectedHeure === h
                      ? 'bg-gold text-white shadow-md scale-105'
                      : 'bg-white border border-cream-dark text-text-primary hover:border-gold hover:text-gold'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Étape 4 — Formulaire (seulement après avoir choisi date + heure) */}
        {selectedHeure && <section>
          <h2 className="font-heading text-xl font-bold text-green-islamic mb-5">
            {preselectedType ? '3.' : '4.'} Vos coordonnées
          </h2>
          <div className="rounded-2xl bg-white border border-cream-dark p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Prénom et Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex : Fatima Benali"
                  className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Téléphone <span className="text-xs font-normal text-text-secondary">(optionnel)</span>
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+33 6 00 00 00 00"
                className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Ce que vous souhaitez travailler <span className="text-xs font-normal text-text-secondary">(optionnel)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Partagez brièvement votre situation ou vos objectifs pour cette séance..."
                className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition resize-none"
              />
            </div>
          </div>
        </section>}

        {/* Récapitulatif + CTA */}
        {selectedService && selectedDate && selectedHeure && (
          <section>
            <div className="rounded-2xl border-2 border-gold/30 bg-gold/5 p-5 sm:p-6">
              <h3 className="font-heading text-base font-bold text-green-islamic mb-4 flex items-center gap-2">
                <span>📋</span> Récapitulatif
              </h3>
              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Type</span>
                  <span className="font-semibold text-text-primary">
                    Coaching {selectedService === 'couple' ? 'de couple' : 'individuel'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Date</span>
                  <span className="font-semibold text-text-primary">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Heure</span>
                  <span className="font-semibold text-text-primary">{selectedHeure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Durée</span>
                  <span className="font-semibold text-text-primary">1h</span>
                </div>
                <div className="border-t border-gold/20 pt-2.5 flex justify-between">
                  <span className="font-semibold text-text-primary">Montant</span>
                  <span className="font-heading text-xl font-bold text-gold">{selectedService ? PRIX[selectedService] : 50}€</span>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                className={`w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                  isFormValid && !loading
                    ? 'bg-gold hover:bg-gold/90 hover:shadow-md active:scale-[0.98]'
                    : 'bg-gold/40 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Redirection vers le paiement...
                  </>
                ) : (
                  <>
                    Confirmer et payer →
                  </>
                )}
              </button>

              {!isFormValid && !loading && (
                <p className="mt-2 text-center text-xs text-text-secondary">
                  Complétez tous les champs obligatoires pour continuer
                </p>
              )}
            </div>
          </section>
        )}

        {/* Infos rassurantes */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Lock, text: 'Paiement sécurisé via Stripe' },
              { icon: RotateCcw, text: 'Annulation possible jusqu\'à 48h avant' },
              { icon: Mail, text: 'Confirmation par email immédiate' },
              { icon: Video, text: 'Séance par visioconférence ou appel vocal' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-xl bg-white border border-cream-dark px-4 py-3 text-sm text-text-secondary">
                <Icon className="h-4 w-4 shrink-0 text-green-islamic" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Lien retour */}
        <div className="text-center pb-4">
          <Link to={fromBio ? '/bio' : '/coaching/services'} className="text-sm text-text-secondary hover:text-gold transition-colors">
            ← {fromBio ? 'Retour' : 'Retour aux services de coaching'}
          </Link>
        </div>
      </div>
    </div>
  );
}
