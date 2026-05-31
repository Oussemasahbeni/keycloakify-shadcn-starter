interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function Logo({ size = 24, className, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="themekey"
      className={className}
      {...props}
    >
      <defs>
        <clipPath id="tk-clip">
          <rect width="32" height="32" rx="5.76" />
        </clipPath>
      </defs>
      <g clipPath="url(#tk-clip)">
        <rect width="32" height="32" fill="#0a0a0a" />
        <rect width="32" height="0.8" fill="#ffffff" opacity="0.10" />
        <g fill="none" stroke="#fafafa" strokeWidth="1.3" opacity="0.92">
          <ellipse cx="16" cy="16" rx="10" ry="4" />
          <ellipse
            cx="16"
            cy="16"
            rx="10"
            ry="4"
            transform="rotate(60 16 16)"
          />
          <ellipse
            cx="16"
            cy="16"
            rx="10"
            ry="4"
            transform="rotate(120 16 16)"
          />
        </g>
        <circle cx="16" cy="16" r="3.2" fill="#0a0a0a" />
        <circle cx="16" cy="14.9" r="1.45" fill="#fafafa" />
        <rect
          x="15.4"
          y="15.3"
          width="1.2"
          height="2.8"
          rx="0.2"
          fill="#fafafa"
        />
        <rect
          x="0.5"
          y="0.5"
          width="31"
          height="31"
          rx="5.26"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      </g>
    </svg>
  )
}
