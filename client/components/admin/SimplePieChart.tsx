interface PieChartSegment {
  label: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: PieChartSegment[];
  size?: number;
  showLegend?: boolean;
  donut?: boolean;
}

export default function SimplePieChart({
  data,
  size = 200,
  showLegend = true,
  donut = true,
}: SimplePieChartProps) {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div
        className="flex items-center justify-center bg-[#F5F5F5] rounded-lg"
        style={{ width: size, height: size }}
      >
        <p className="text-[#999999] font-lato text-sm text-center">
          Aucune donnée
        </p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const sliceAngle = (item.value / total) * 360;

    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const radius = size / 2 - 20;
    const innerRadius = donut ? size / 2 - 35 : 0;

    const x1 = size / 2 + radius * Math.cos(startRad);
    const y1 = size / 2 + radius * Math.sin(startRad);

    const x2 = size / 2 + radius * Math.cos(endRad);
    const y2 = size / 2 + radius * Math.sin(endRad);

    const ix1 = size / 2 + innerRadius * Math.cos(startRad);
    const iy1 = size / 2 + innerRadius * Math.sin(startRad);

    const ix2 = size / 2 + innerRadius * Math.cos(endRad);
    const iy2 = size / 2 + innerRadius * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    let pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    if (donut) {
      pathData += ` L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1} Z`;
    } else {
      pathData += ` L ${size / 2} ${size / 2} Z`;
    }

    const labelAngle = startAngle + sliceAngle / 2;
    const labelRad = (labelAngle * Math.PI) / 180;
    const labelRadius = radius * 0.7;
    const labelX = size / 2 + labelRadius * Math.cos(labelRad);
    const labelY = size / 2 + labelRadius * Math.sin(labelRad);

    currentAngle = endAngle;

    return {
      path: pathData,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage: percentage.toFixed(1),
      labelX,
      labelY,
    };
  });

  const maxLabelWidth = 120;
  const legendX = size + 20;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ maxWidth: "100%" }}
        >
          {segments.map((segment, i) => (
            <g key={`segment-${i}`}>
              <path
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                opacity="0.9"
              />
              {parseFloat(segment.percentage) > 5 && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill="white"
                  fontFamily="Lato, sans-serif"
                  pointerEvents="none"
                >
                  {segment.percentage}%
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {showLegend && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {segments.map((segment, i) => (
            <div key={`legend-${i}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-lato text-[#6B3E26] truncate">
                  {segment.label}
                </p>
                <p className="text-xs font-playfair font-bold text-[#F58220]">
                  {segment.percentage}% ({segment.value})
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
