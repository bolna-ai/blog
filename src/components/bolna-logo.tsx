import { BASE_PATH } from "@/lib/links";

/**
 * Bolna's logo, served as the official SVG files (not redrawn or recoloured).
 * Both variants render and CSS picks one per theme: black on light surfaces,
 * white on dark ones. `onDark` pins the white file for surfaces that are
 * always dark (the footer). Plain <img> tags don't get basePath, so it is
 * prefixed explicitly.
 */
export function BolnaLogo({
  height = 26,
  onDark = false,
}: {
  height?: number;
  onDark?: boolean;
}) {
  const width = Math.round((height * 944) / 229);
  const common = { width, height, style: { height, width: "auto" } };
  if (onDark) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`${BASE_PATH}/logos/bolna-full-white.svg`} alt="Bolna" {...common} />
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE_PATH}/logos/bolna-full-black.svg`}
        alt="Bolna"
        className="dark:hidden"
        {...common}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE_PATH}/logos/bolna-full-white.svg`}
        alt=""
        aria-hidden="true"
        className="hidden dark:block"
        {...common}
      />
    </>
  );
}
