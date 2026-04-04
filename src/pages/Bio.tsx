import { Star, CalendarCheck, HeartHandshake, User } from 'lucide-react';

export default function Bio() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white flex flex-col items-center justify-center px-4 py-12">

      {/* Avatar + nom */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 rounded-full bg-green-islamic flex items-center justify-center shadow-md mb-4">
          <Star className="h-9 w-9 text-white fill-white" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-text-primary">Dr Fère Muz</h1>
        <p className="text-sm text-text-secondary mt-1 text-center max-w-xs">
          Praticienne en Roqya · Coach de vie islamique
        </p>
      </div>

      {/* Boutons */}
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* Coaching Psycho-Roqya */}
        <a
          href="https://coachmynefs.com/coaching/reserver"
          className="flex items-center gap-4 rounded-2xl bg-green-islamic px-6 py-4 text-white shadow-md transition hover:bg-green-islamic/90 active:scale-95"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Coaching Psycho-Roqya individuel</p>
          </div>
        </a>

        {/* Coaching individuel ou de couple */}
        <a
          href="https://coachmynefs.com/coaching/reserver"
          className="flex items-center gap-4 rounded-2xl bg-gold px-6 py-4 text-white shadow-md transition hover:bg-gold/90 active:scale-95"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Coaching individuel ou de couple</p>
          </div>
        </a>

        {/* Qui suis-je */}
        <a
          href="https://coachmynefs.com/qui-suis-je"
          className="flex items-center gap-4 rounded-2xl border border-cream-dark bg-white px-6 py-4 text-text-primary shadow-sm transition hover:bg-cream active:scale-95"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-dark">
            <User className="h-5 w-5 text-text-secondary" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">En savoir plus sur moi</p>
            <p className="text-xs text-text-secondary mt-0.5">Mon parcours & ma démarche</p>
          </div>
        </a>

      </div>

      {/* Footer discret */}
      <p className="mt-12 text-xs text-text-secondary/50">
        coachmynefs.com
      </p>
    </div>
  );
}
