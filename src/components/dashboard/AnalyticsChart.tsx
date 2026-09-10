import { useMemo } from 'react';
import type { ChartType, Currency, Transaction } from '@/types';
import { CHART_COLORS } from '@/utils/icons';
import { formatMoney } from '@/utils/format';
import { useAppData } from '@/context/AppDataContext';

interface CategorySlice {
  category: string;
  amount: number;
  pct: number;
  color: string;
}

function buildSlices(transactions: Transaction[]): CategorySlice[] {
  const totals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'exp')
    .forEach((t) => {
      const key = t.category || 'Other';
      totals[key] = (totals[key] || 0) + t.amount;
    });
  const sum = Object.values(totals).reduce((a, b) => a + b, 0);
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([category, amount], i) => ({
      category,
      amount,
      pct: sum > 0 ? (amount / sum) * 100 : 0,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
}

export default function AnalyticsChart({ transactions, type }: { transactions: Transaction[]; type: ChartType }) {
  const { settings } = useAppData();
  const slices = useMemo(() => buildSlices(transactions), [transactions]);
  const totalSpent = slices.reduce((s, x) => s + x.amount, 0);

  if (slices.length === 0) {
    return (
      <div className="chart-layout">
        <div className="chart-info">
          <div className="stat-label">Top Category</div>
          <div className="stat-val">No expenses yet</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-layout">
      <div className="chart-info">
        <div className="stat-label">Top Category</div>
        <div className="stat-val">{slices[0].category}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          {formatMoney(slices[0].amount, settings.currency)} ({slices[0].pct.toFixed(0)}%)
        </div>
      </div>
      <div className="chart-canvas-wrapper">
        {type === 'bar' && <BarView slices={slices} />}
        {type === 'circle' && <DonutView slices={slices} total={totalSpent} currency={settings.currency} />}
        {type === 'radar' && <RadarView slices={slices} />}
      </div>
    </div>
  );
}

function BarView({ slices }: { slices: CategorySlice[] }) {
  const max = Math.max(...slices.map((s) => s.amount), 1);
  return (
    <>
      {slices.map((s) => (
        <div className="html-bar-row" key={s.category}>
          <span className="html-bar-label">{s.category}</span>
          <div className="html-bar-track">
            <div
              className="html-bar-fill"
              style={{ width: `${(s.amount / max) * 100}%`, background: s.color }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

function DonutView({ slices, total, currency }: { slices: CategorySlice[]; total: number; currency: Currency }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <svg viewBox="0 0 100 100" width="120" height="120" style={{ flexShrink: 0 }}>
      <g transform="rotate(-90 50 50)">
        {slices.map((s) => {
          const dash = (s.pct / 100) * circumference;
          const el = (
            <circle
              key={s.category}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offsetAcc}
            />
          );
          offsetAcc += dash;
          return el;
        })}
      </g>
      <text x="50" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
        {formatMoney(total, currency).split(' ')[0]}
      </text>
    </svg>
  );
}

function RadarView({ slices }: { slices: CategorySlice[] }) {
  const n = slices.length;
  const size = 110;
  const center = size / 2;
  const maxR = center - 18;
  const max = Math.max(...slices.map((s) => s.amount), 1);

  const points = slices.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (s.amount / max) * maxR;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  });
  const poly = points.map((p) => p.join(',')).join(' ');

  const labelPoints = slices.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: center + (maxR + 12) * Math.cos(angle),
      y: center + (maxR + 12) * Math.sin(angle),
      label: s.category,
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ flexShrink: 0, overflow: 'visible' }}>
      {[0.33, 0.66, 1].map((f) => (
        <circle key={f} cx={center} cy={center} r={maxR * f} fill="none" stroke="var(--border-color)" strokeWidth="1" />
      ))}
      <polygon points={poly} fill="var(--primary-color)" fillOpacity="0.35" stroke="var(--primary-color)" strokeWidth="2" />
      {labelPoints.map((p) => (
        <text key={p.label} x={p.x} y={p.y} textAnchor="middle" fontSize="7" fill="var(--text-secondary)">
          {p.label.slice(0, 4)}
        </text>
      ))}
    </svg>
  );
}
