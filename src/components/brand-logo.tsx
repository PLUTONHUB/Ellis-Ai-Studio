type BrandLogoProps = {
  variant?: "lockup" | "icon";
  className?: string;
};

export function BrandLogo({
  variant = "lockup",
  className = "",
}: BrandLogoProps) {
  const src =
    variant === "icon"
      ? "/logo/ellis-logo-icon.png"
      : "/logo/ellis-logo-lockup.webp";

  const alt = "Ellis AI Studio";

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      draggable={false}
    />
  );
}
