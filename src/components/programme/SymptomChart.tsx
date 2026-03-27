import { useState } from 'react';
import { TrendingDown, TrendingUp, Minus, BarChart3 } from 'lucide-react';
import { type SymptomEntry, SYMPTOM_KEYS, loadSymptomHistory } from './SymptomTracker';

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════

export default function SymptomChart() {
  const history = loadSymptomHistory();
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="card-islamic p-6 text-center">
        <BarChart3 className="mx-auto h-10 w-10 text-text-secondary/30" />
        <p className="mt-3 text-sm text-text-secondary">
          Aucun bilan enregistré. Complétez votre premier bilan hebdomadaire pour voir votre évolution.
        </p>
      </div>
    );
  }

  // Calcul du score moyen (exclure wellbeing ou l'inverser)
  const getAverage = (entry: SymptomEntry, symptomId?: string): number => {
    if (symptomId) {
      const val = entry.scores[symptomId] ?? 5;
      // Inverser le bien-être pour le score global
      return symptomId === 'wellbeing' ? 10 - val : val;
    }
    const keys = SYMPTOM_KEYS.map((s) => s.id);
    const sum = keys.reduce((acc, key) => {
      const val = entry.scores[key] ?? 5;
      return acc + (key === 'wellbeing' ? 10 - val : val);
    }, 0);
    return Math.round((sum / keys.length) * 10) / 10;
  };

  // Données pour le graphique
  const dataPoints = history.map((entry) => ({
    week: entry.week,
    value: selectedSymptom ? getAverage(entry, selectedSymptom) : getAverage(entry),
    raw: entry,
  }));

  // Tendance
  const first = dataPoints[0].value;
  const last = dataPoints[dataPoints.length - 1].value;
  const trend = last < first ? 'improving' : last > first ? 'worsening' : 'stable';
  const changePercent = first > 0 ? Math.round(Math.abs(((last - first) / first) * 100)) : 0;

  // Dimensions SVG
  const width = 320;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Échelle
  const maxWeek = Math.max(...dataPoints.map((d) => d.week));
  const minWeek = Math.min(...dataPoints.map((d) => d.week));
  const weekRange = Math.max(maxWeek - minWeek, 1);

  const getX = (week: number) => paddingX + ((week - minWeek) / weekRange) * chartW;
  const getY = (value: number) => paddingY + ((10 - value) / 10) * chartH;

  // Chemin de la ligne
  const linePath = dataPoints
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.week)} ${getY(d.value)}`)
    .join(' ');

  // Zone remplie sous la courbe
  const areaPath = `${linePath} L ${getX(dataPoints[dataPoints.length - 1].week)} ${getY(0)} L ${getX(dataPoints[0].week)} ${getY(0)} Z`;

  const lineColor = trend === 'improving' ? '#2D6A4F' : trend === 'worsening' ? '#DC2626' : '#B5832A';

  return (
    <div className="space-y-4">
      {/* Carte résumé */}
      <div className="card-islamic p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary">Tendance globale</p>
            <div className="flex items-center gap-2 mt-1">
              {trend === 'improving' && (
                <>
                  <TrendingDown className="h-5 w-5 text-green-islamic" />
                  <span className="text-sm font-bold text-green-islamic">
                    En amélioration (-{changePercent}%)
                  </span>
                </>
              )}
              {trend === 'worsening' && (
                <>
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-bold text-red-600">
                    En hausse (+{changePercent}%)
                  </span>
                </>
              )}
              {trend === 'stable' && (
                <>
                  <Minus className="h-5 w-5 text-gold" />
                  <span className="text-sm font-bold text-gold">Stable</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-secondary">Score actuel</p>
            <p className={`text-2xl font-bold ${
              last <= 3 ? 'text-green-islamic' : last <= 6 ? 'text-gold' : 'text-red-600'
            }`}>
              {last}/10
            </p>
          </div>
        </div>
      </div>

      {/* Graphique SVG */}
      <div className="card-islamic p-4">
        <h4 className="text-sm font-semibold text-text-primary mb-3">
          {selectedSymptom
            ? SYMPTOM_KEYS.find((s) => s.id === selectedSymptom)?.label
            : 'Score moyen des symptômes'
          }
        </h4>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Lignes horizontales de grille */}
          {[0, 2.5, 5, 7.5, 10].map((val) => (
            <g key={val}>
              <line
                x1={paddingX}
                y1={getY(val)}
                x2={width - paddingX}
                y2={getY(val)}
                stroke="#EDE5D4"
                strokeWidth={1}
              />
              <text
                x={paddingX - 8}
                y={getY(val) + 4}
                textAnchor="end"
                className="fill-text-secondary"
                fontSize={10}
              >
                {val}
              </text>
            </g>
          ))}

          {/* Labels semaines */}
          {dataPoints.map((d) => (
            <text
              key={d.week}
              x={getX(d.week)}
              y={height - 5}
              textAnchor="middle"
              className="fill-text-secondary"
              fontSize={10}
            >
              S{d.week}
            </text>
          ))}

          {/* Zone colorée sous la courbe */}
          <path
            d={areaPath}
            fill={lineColor}
            opacity={0.08}
          />

          {/* Ligne de la courbe */}
          <path
            d={linePath}
            fill="none"
            stroke={lineColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {dataPoints.map((d) => (
            <circle
              key={d.week}
              cx={getX(d.week)}
              cy={getY(d.value)}
              r={4}
              fill="white"
              stroke={lineColor}
              strokeWidth={2}
            />
          ))}

          {/* Valeurs sur les points */}
          {dataPoints.map((d) => (
            <text
              key={`label-${d.week}`}
              x={getX(d.week)}
              y={getY(d.value) - 10}
              textAnchor="middle"
              fill={lineColor}
              fontSize={10}
              fontWeight="bold"
            >
              {d.value}
            </text>
          ))}
        </svg>
      </div>

      {/* Filtre par symptôme */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSymptom(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            !selectedSymptom
              ? 'bg-green-islamic text-white'
              : 'bg-cream-dark text-text-secondary hover:bg-cream-dark/80'
          }`}
        >
          Tous
        </button>
        {SYMPTOM_KEYS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSymptom(s.id === selectedSymptom ? null : s.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedSymptom === s.id
                ? 'bg-green-islamic text-white'
                : 'bg-cream-dark text-text-secondary hover:bg-cream-dark/80'
            }`}
          >
            {s.emoji} {s.label.split('/')[0].trim()}
          </button>
        ))}
      </div>

      {/* Détails du dernier bilan */}
      {history.length > 0 && (
        <div className="card-islamic p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-3">
            Dernier bilan (Semaine {history[history.length - 1].week})
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {SYMPTOM_KEYS.map((s) => {
              const val = history[history.length - 1].scores[s.id] ?? 5;
              const prev = history.length > 1 ? history[history.length - 2].scores[s.id] ?? 5 : null;
              const isGood = s.id === 'wellbeing' ? val >= 7 : val <= 3;
              const isBad = s.id === 'wellbeing' ? val <= 3 : val >= 7;

              return (
                <div
                  key={s.id}
                  className={`rounded-lg px-3 py-2 ${
                    isGood ? 'bg-green-islamic/5' : isBad ? 'bg-red-50' : 'bg-gold/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">{s.emoji} {s.label.split('/')[0].trim()}</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-bold ${
                        isGood ? 'text-green-islamic' : isBad ? 'text-red-600' : 'text-gold'
                      }`}>
                        {val}
                      </span>
                      {prev !== null && (
                        <span className={`text-xs ${
                          s.id === 'wellbeing'
                            ? val > prev ? 'text-green-islamic' : val < prev ? 'text-red-600' : 'text-text-secondary'
                            : val < prev ? 'text-green-islamic' : val > prev ? 'text-red-600' : 'text-text-secondary'
                        }`}>
                          {val === prev ? '=' : s.id === 'wellbeing'
                            ? (val > prev ? '↑' : '↓')
                            : (val < prev ? '↓' : '↑')
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
