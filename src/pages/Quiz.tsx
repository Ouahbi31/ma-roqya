import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { quizQuestions } from '../data/quizQuestions';
import SEO from '../components/SEO';

const JSON_LD_FAQ = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment savoir si j\'ai le mauvais œil (ayn) ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les signes du mauvais œil incluent : maux de tête fréquents sans cause médicale, fatigue intense, tristesse inexpliquée, problèmes relationnels soudains. Notre quiz gratuit vous aide à évaluer votre situation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qu\'est-ce que la roqya shar\'iyya ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La roqya shar\'iyya est un traitement spirituel islamique basé sur la récitation de versets coraniques et de supplications authentiques. Elle est utilisée contre le mauvais œil, la sorcellerie et la possession.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment distinguer une maladie spirituelle d\'une maladie psychologique ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'L\'approche Psycho-Roqya de CoachMyNefs analyse les deux dimensions : spirituelle (ayn, sihr, mass) et psychologique. Notre questionnaire adaptatif évalue les deux aspects pour proposer un programme personnalisé.',
      },
    },
    {
      '@type': 'Question',
      name: 'La roqya peut-elle aider contre la sorcellerie ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, la roqya shar\'iyya est reconnue pour son efficacité contre la sorcellerie (sihr). Le programme CoachMyNefs pour le sihr dure 30 jours avec 3 phases progressives basées sur le Coran et la Sunnah.',
      },
    },
  ],
});

export default function Quiz() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [started, setStarted] = useState(false);

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleFinish = () => {
    const score = Object.values(answers).reduce((sum, v) => sum + v, 0);
    navigate('/quiz/resultat', { state: { score, total: totalQuestions * 3 } });
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-cream px-4 py-12 sm:px-6 lg:px-8">
        <SEO
          title="Quiz d'auto-evaluation spirituelle - CoachMyNefs"
          description="Evaluez votre situation spirituelle avec notre quiz. Identifiez les signes potentiels de mauvais oeil, sorcellerie ou possession et recevez des conseils personnalises."
          keywords="quiz roqya, test mauvais oeil, symptomes sorcellerie test, auto-evaluation spirituelle islam"
          url="/quiz"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD_FAQ }} />
        <div className="mx-auto max-w-2xl text-center">
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-green-islamic transition-colors">
            <ArrowLeft size={15} /> Accueil
          </Link>
          <h1 className="mb-4 font-heading text-3xl font-bold text-green-islamic sm:text-4xl">
            {t('quiz.title')}
          </h1>
          <p className="mb-6 text-lg text-text-secondary">{t('quiz.subtitle')}</p>

          <div className="card-islamic mx-auto mb-8 max-w-lg p-6">
            <div className="mb-3 flex items-center gap-2 text-gold">
              <AlertTriangle size={20} />
              <span className="text-sm font-semibold">Avertissement</span>
            </div>
            <p className="text-sm text-text-secondary">{t('quiz.disclaimer')}</p>
          </div>

          <button onClick={() => setStarted(true)} className="btn-primary text-lg">
            {t('quiz.start')}
          </button>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const hasAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm text-text-secondary">
            <span>{t('quiz.question_of', { current: currentIndex + 1, total: totalQuestions })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
            <div
              className="h-full rounded-full bg-green-islamic transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="card-islamic p-6 sm:p-8">
          <h2 className="mb-2 font-heading text-xl font-bold text-text-primary">
            {currentQuestion.texte_fr}
          </h2>
          <p className="text-arabic mb-6 text-base text-text-secondary">{currentQuestion.texte_ar}</p>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  answers[currentQuestion.id] === opt.value
                    ? 'border-green-islamic bg-green-islamic/5'
                    : 'border-cream-dark hover:border-green-light'
                }`}
              >
                <span className="font-medium text-text-primary">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-cream-dark disabled:opacity-30 active:scale-[0.97]"
          >
            <ChevronLeft size={18} /> {t('quiz.previous')}
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleFinish}
              disabled={!hasAnswered}
              className="btn-primary disabled:opacity-50"
            >
              {t('quiz.finish')}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="flex items-center gap-1 rounded-lg bg-green-islamic px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gold disabled:opacity-50 active:scale-[0.97]"
            >
              {t('quiz.next')} <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
