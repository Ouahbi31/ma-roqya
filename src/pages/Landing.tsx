import { Link } from 'react-router-dom';
import { Shield, Heart, Star } from 'lucide-react';
import SEO from '../components/SEO';

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SEO
        title="CoachMyNefs - Choisissez votre espace"
        description="CoachMyNefs vous accompagne dans votre guérison spirituelle avec la roqya shar'iyya et dans votre développement personnel avec le coaching et l'accompagnement de couple."
        keywords="coaching, développement personnel, roqya, accompagnement de couple, psycho-roqya, CoachMyNefs"
        url="/"
      />

      {/* Islamic pattern background */}
      <div className="islamic-pattern-bg fixed inset-0 z-0 opacity-30" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16">
        {/* Logo & Title */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="h-7 w-7 text-gold fill-gold" />
            <span className="font-heading text-2xl sm:text-3xl font-bold text-green-islamic">
              CoachMyNefs
            </span>
          </div>
          <p className="text-text-secondary text-base sm:text-lg max-w-sm mx-auto leading-relaxed">
            Choisissez votre espace
          </p>
          <div className="w-16 h-0.5 bg-gold/40 mx-auto mt-4" />
        </div>

        {/* Cards container */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Carte Roqya */}
          <Link
            to="/roqya"
            className="group card-islamic flex flex-col items-center text-center p-7 sm:p-9 gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-islamic/40"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-islamic/10 group-hover:bg-green-islamic/20 transition-colors">
              <Shield className="h-8 w-8 text-green-islamic" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-green-islamic mb-2">
                Roqya & Psycho-Roqya
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Guérison spirituelle, protection, douas et programme roqya basés sur le Coran et la Sunnah
              </p>
            </div>
            <span className="mt-auto inline-flex items-center justify-center rounded-xl bg-green-islamic px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-islamic/90 group-hover:bg-green-islamic/90">
              Entrer
            </span>
          </Link>

          {/* Carte Coaching */}
          <Link
            to="/coaching"
            className="group card-islamic flex flex-col items-center text-center p-7 sm:p-9 gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold/40"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 group-hover:bg-gold/20 transition-colors">
              <Heart className="h-8 w-8 text-gold" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-gold mb-2">
                Coaching & Accompagnement
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Développement personnel, couple, motivation et confiance en Allah
              </p>
            </div>
            <span className="mt-auto inline-flex items-center justify-center rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold/90 group-hover:bg-gold/90">
              Entrer
            </span>
          </Link>
        </div>

        {/* Verset en bas */}
        <div className="mt-12 sm:mt-16 text-center max-w-lg mx-auto">
          <p className="text-arabic text-xl sm:text-2xl text-gold leading-relaxed">
            وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ
          </p>
          <p className="mt-2 text-xs text-text-secondary italic">
            « Nous faisons descendre du Coran ce qui est une guérison et une miséricorde pour les croyants »
          </p>
          <p className="mt-1 text-xs text-text-secondary opacity-70">
            Sourate Al-Isra, 17:82
          </p>
        </div>
      </div>
    </div>
  );
}
