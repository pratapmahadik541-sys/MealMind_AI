import React, { useState, useRef, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCard3DProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  trendText: string;
  trendPositive: boolean;
  sublabel: string;
  subvalue: string;
  icon: LucideIcon;
  sparklineData: number[];
  accentColor?: 'emerald' | 'amber' | 'blue' | 'coral' | 'teal';
}

export const MetricCard3D: React.FC<MetricCard3DProps> = ({
  title,
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  trendText,
  trendPositive,
  sublabel,
  subvalue,
  icon: Icon,
  sparklineData,
  accentColor = 'emerald',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;
    const startVal = displayValue;
    const endVal = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 5;
    const rotY = ((x - centerX) / centerX) * 5;

    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const width = 84;
  const height = 28;

  const points = sparklineData
    .map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor =
    accentColor === 'amber'
      ? '#f59e0b'
      : accentColor === 'coral'
      ? '#f43f5e'
      : accentColor === 'blue'
      ? '#2563eb'
      : accentColor === 'teal'
      ? '#0d9488'
      : '#059669';

  const iconBg =
    accentColor === 'amber'
      ? 'bg-amber-50 text-amber-600 border-amber-200'
      : accentColor === 'coral'
      ? 'bg-rose-50 text-rose-600 border-rose-200'
      : accentColor === 'blue'
      ? 'bg-blue-50 text-blue-600 border-blue-200'
      : accentColor === 'teal'
      ? 'bg-teal-50 text-teal-600 border-teal-200'
      : 'bg-emerald-50 text-emerald-600 border-emerald-200';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
          isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
        }`,
        transition: isHovered
          ? 'transform 0.08s ease-out'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="relative rounded-2xl p-5 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all select-none overflow-hidden"
    >
      {/* Top Title & Icon */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Counter + Sparkline */}
      <div className="flex items-baseline justify-between gap-3 my-1">
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-xs text-slate-400 font-sans font-medium">{prefix}</span>}
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
            {displayValue.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </span>
          {suffix && <span className="text-xs font-medium text-slate-500 ml-1">{suffix}</span>}
        </div>

        {/* Mini Line Chart Sparkline */}
        <div className="w-[84px] h-[28px] opacity-85 group-hover:opacity-100 transition-opacity">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Footer Subvalue and Percentage Indicator */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">{sublabel}:</span>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-semibold text-[11px] px-1.5 py-0.5 rounded ${
              trendPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {trendText}
          </span>
          <span className="font-semibold text-slate-800">{subvalue}</span>
        </div>
      </div>
    </div>
  );
};
