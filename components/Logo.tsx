type LogoProps = {
  width?: number;
  height?: number;
  /** "brand" = três tons de laranja; "dark" = preto em opacidades (para fundo laranja) */
  variant?: "brand" | "dark" | "solid";
  className?: string;
  label?: string;
};

const SHAPES = [
  "0,0 10,5.88 10,34.12 0,40",
  "12,7.06 22,12.94 22,27.06 12,32.94",
  "24,14.12 34,20 24,25.88",
];

const FILLS = {
  brand: [
    { fill: "#FFB37A" },
    { fill: "#FF8A3D" },
    { fill: "#FF5A1F" },
  ],
  dark: [
    { fill: "#0E0E10", opacity: 0.45 },
    { fill: "#0E0E10", opacity: 0.7 },
    { fill: "#0E0E10" },
  ],
  solid: [{ fill: "#0E0E10" }, { fill: "#0E0E10" }, { fill: "#0E0E10" }],
};

export function Logo({ width = 34, height = 40, variant = "brand", className, label }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 34 40"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {SHAPES.map((points, i) => (
        <polygon key={points} points={points} {...FILLS[variant][i]} />
      ))}
    </svg>
  );
}
