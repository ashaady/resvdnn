interface DataPoint {
  name: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  height?: number;
  showGrid?: boolean;
  color?: string;
  yAxisLabel?: string;
}

export default function SimpleLineChart({
  data,
  height = 300,
  showGrid = true,
  color = "#F58220",
  yAxisLabel = "Montant",
}: SimpleLineChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-[#F5F5F5] rounded-lg"
        style={{ height }}
      >
        <p className="text-[#999999] font-lato">Aucune donnée</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = 0;
  const range = maxValue - minValue;

  // Calculate points for SVG line
  const width = 100;
  const padding = 10;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 60;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
    const y =
      height -
      40 -
      ((point.value - minValue) / (range || 1)) * chartHeight;
    return { x, y, ...point };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${height - 40} L ${points[0].x} ${height - 40} Z`;

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
      >
        {/* Grid */}
        {showGrid && (
          <>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={`grid-${i}`}
                x1={0}
                y1={height - 40 - ratio * (height - 60)}
                x2={width}
                y2={height - 40 - ratio * (height - 60)}
                stroke="#E5E5E5"
                strokeWidth="0.5"
              />
            ))}
          </>
        )}

        {/* Area under curve */}
        <path d={areaD} fill={color} fillOpacity="0.1" />

        {/* Line */}
        <path d={pathD} stroke={color} strokeWidth="2" fill="none" />

        {/* Points */}
        {points.map((point, i) => (
          <circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r="1.5"
            fill={color}
          />
        ))}

        {/* X Axis */}
        <line
          x1={0}
          y1={height - 40}
          x2={width}
          y2={height - 40}
          stroke="#D4AF37"
          strokeWidth="1"
        />

        {/* Y Axis Labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = Math.round(minValue + ratio * range);
          const y = height - 40 - ratio * (height - 60);
          return (
            <text
              key={`y-label-${i}`}
              x={padding - 2}
              y={y + 2}
              fontSize="8"
              textAnchor="end"
              fill="#999999"
            >
              {value}
            </text>
          );
        })}

        {/* X Axis Labels */}
        {points.map((point, i) => {
          if (i % Math.ceil(points.length / 5) === 0 || i === points.length - 1) {
            return (
              <text
                key={`x-label-${i}`}
                x={point.x}
                y={height - 10}
                fontSize="8"
                textAnchor="middle"
                fill="#999999"
              >
                {point.name}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}
