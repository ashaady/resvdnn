interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  height?: number;
  horizontal?: boolean;
  showValues?: boolean;
  color?: string;
}

export default function SimpleBarChart({
  data,
  height = 300,
  horizontal = false,
  showValues = true,
  color = "#F58220",
}: SimpleBarChartProps) {
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
  const padding = horizontal ? 100 : 40;

  if (horizontal) {
    // Horizontal bar chart
    const barHeight = Math.max(30, (height - padding) / data.length);

    return (
      <div style={{ height, width: "100%" }} className="flex flex-col">
        <svg width="100%" height={height} className="w-full">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const y = padding / 2 + index * barHeight;
            const barWidth = (percentage / 100) * (window.innerWidth * 0.6 - 120);

            return (
              <g key={`bar-${index}`}>
                {/* Label */}
                <text
                  x={10}
                  y={y + barHeight / 2}
                  fontSize="12"
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill="#6B3E26"
                  fontFamily="Lato, sans-serif"
                  fontWeight="600"
                >
                  {item.label}
                </text>

                {/* Bar background */}
                <rect
                  x={padding}
                  y={y + barHeight * 0.2}
                  width={window.innerWidth * 0.6 - 140}
                  height={barHeight * 0.6}
                  fill="#F5F5F5"
                  rx="4"
                />

                {/* Bar */}
                <rect
                  x={padding}
                  y={y + barHeight * 0.2}
                  width={Math.max(0, barWidth)}
                  height={barHeight * 0.6}
                  fill={item.color || color}
                  rx="4"
                />

                {/* Value */}
                {showValues && (
                  <text
                    x={padding + Math.max(0, barWidth) + 10}
                    y={y + barHeight / 2}
                    fontSize="11"
                    dominantBaseline="middle"
                    fill="#6B3E26"
                    fontFamily="Lato, sans-serif"
                    fontWeight="bold"
                  >
                    {item.value}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  } else {
    // Vertical bar chart
    const chartWidth = Math.max(400, data.length * 80);
    const barWidth = Math.min(60, (chartWidth - padding * 2) / data.length * 0.8);
    const chartHeight = height - 60;

    return (
      <div className="w-full overflow-x-auto">
        <svg
          width={chartWidth}
          height={height}
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="w-full"
        >
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={`grid-${i}`}
              x1={padding}
              y1={height - 40 - ratio * chartHeight}
              x2={chartWidth - padding}
              y2={height - 40 - ratio * chartHeight}
              stroke="#E5E5E5"
              strokeWidth="1"
            />
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const x = padding + index * ((chartWidth - 2 * padding) / data.length) +
              ((chartWidth - 2 * padding) / data.length - barWidth) / 2;
            const barHeight = (percentage / 100) * chartHeight;

            return (
              <g key={`bar-${index}`}>
                {/* Bar */}
                <rect
                  x={x}
                  y={height - 40 - barHeight}
                  width={barWidth}
                  height={Math.max(0, barHeight)}
                  fill={item.color || color}
                  rx="4"
                  opacity="0.9"
                />

                {/* Value on top of bar */}
                {showValues && (
                  <text
                    x={x + barWidth / 2}
                    y={height - 45 - barHeight}
                    fontSize="11"
                    textAnchor="middle"
                    fill="#6B3E26"
                    fontFamily="Lato, sans-serif"
                    fontWeight="bold"
                  >
                    {item.value}
                  </text>
                )}

                {/* Label */}
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  fontSize="12"
                  textAnchor="middle"
                  fill="#999999"
                  fontFamily="Lato, sans-serif"
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={padding}
            y1={height - 40}
            x2={chartWidth - padding}
            y2={height - 40}
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const value = Math.round(ratio * maxValue);
            return (
              <text
                key={`y-label-${i}`}
                x={padding - 10}
                y={height - 40 - ratio * chartHeight + 4}
                fontSize="10"
                textAnchor="end"
                fill="#999999"
                fontFamily="Lato, sans-serif"
              >
                {value}
              </text>
            );
          })}
        </svg>
      </div>
    );
  }
}
