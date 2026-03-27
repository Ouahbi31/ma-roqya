import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { quizQuestions } from '../data/quizQuestions';
import SEO from '../components/SEO';

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
          title="Quiz d'auto-evaluation spirituelle - MaRoqya"
          description="Evaluez votre situation spirituelle avec notre quiz. Identifiez les signes potentiels de mauvais oeil, sorcellerie ou possession et recevez des conseils personnalises."
          keywords="quiz roqya, test mauvais oeil, symptomes sorcellerie test, auto-evaluation spirituelle islam"
          url="/quiz"
        />
        <div className="mx-auto max-w-2xl text-center">
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
            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-cream-dark disabled:opacity-30"
          >
            <ChevronLeft size={16} /> {t('quiz.previous')}
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
              className="flex items-center gap-1 rounded-lg bg-green-islamic px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold disabled:opacity-50"
            >
              {t('quiz.next')} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
