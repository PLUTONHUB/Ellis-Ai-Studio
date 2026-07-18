type PortfolioCardData = {
  title: string;
  description: string;
  label: string;
  icon: "home" | "service" | "gym" | "dental" | "spa";
  tags: string[];
  imageSrc: string;
  imageAlt: string;
};

const portfolioCards: PortfolioCardData[] = [
  {
    title: "Service Business Conversion System",
    description:
      "Structured for high-intent service demand with rapid trust proof and clear conversion paths.",
    label: "Primary Niche · Demo System",
    icon: "home",
    tags: ["Acquisition", "Response", "Conversion"],
    imageSrc: "/portfolio/demo-hvac-booking-thumbnail.png",
    imageAlt: "Service business conversion page preview",
  },
  {
    title: "HVAC Booking Velocity",
    description:
      "Built to reduce response lag with seasonality-driven messaging and direct booking pathways.",
    label: "Primary Niche · Demo System",
    icon: "service",
    tags: ["Response", "Conversion", "HVAC"],
    imageSrc: "/portfolio/demo-hvac-booking-thumbnail.png",
    imageAlt: "Demo HVAC booking page preview",
  },
  {
    title: "Boutique Gym Membership Flow",
    description:
      "High-intent pass claims and membership prompts engineered for rapid close follow-through.",
    label: "Secondary Niche · Demo System",
    icon: "gym",
    tags: ["Acquisition", "Conversion", "Fitness"],
    imageSrc: "/portfolio/demo-boutique-gym-membership-thumbnail.png",
    imageAlt: "Demo boutique gym membership funnel preview",
  },
  {
    title: "Dental Appointment Lift",
    description:
      "Trust-first patient journey with clear procedure pathways and friction-light scheduling.",
    label: "Secondary Niche · Demo System",
    icon: "dental",
    tags: ["Conversion", "Retention", "Dentists"],
    imageSrc: "/portfolio/demo-dental-clinic-booking-thumbnail.png",
    imageAlt: "Demo dental booking website preview",
  },
  {
    title: "MedSpa Consultation Funnel",
    description:
      "Premium aesthetic consultation flow designed to increase booked consult rates and follow-up compliance.",
    label: "Secondary Niche · Demo System",
    icon: "spa",
    tags: ["Conversion", "Retention", "Med Spas"],
    imageSrc: "/portfolio/demo-medspa-consultation-thumbnail.png",
    imageAlt: "Demo med spa consultation booking funnel preview",
  },
];

export function PortfolioShowcase() {
  return (
    <section id="portfolio" className="border-b border-zinc-900 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Demo Portfolio
            </span>
            <h2 className="text-3xl font-light text-white md:text-4xl">
              Friction-Removal Systems by Niche
            </h2>
          </div>
          <p className="max-w-md text-sm text-zinc-400">
            All entries are clearly labeled demos and show how we remove acquisition,
            response, conversion, and retention friction by vertical.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {portfolioCards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 p-6"
            >
              <div className="mb-5 overflow-hidden rounded-xl border border-zinc-800">
                <img
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
                <PortfolioIcon type={card.icon} />
              </div>

              <div className="absolute right-4 top-4 rounded border border-zinc-700 bg-zinc-900/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-200 backdrop-blur">
                {card.label}
              </div>

              <h3 className="mb-2 text-lg font-bold text-white">{card.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-zinc-400">
                {card.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={`${card.title}-${tag}`}
                    className="rounded-md bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioIcon({ type }: { type: PortfolioCardData["icon"] }) {
  if (type === "home") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12l9-9 9 9" />
        <path d="M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
      </svg>
    );
  }

  if (type === "service") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 8h16" />
        <path d="M4 16h16" />
        <path d="M8 4v16" />
        <path d="M16 4v16" />
      </svg>
    );
  }

  if (type === "gym") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 6.5h11M6.5 17.5h11" />
        <rect x="2" y="9" width="20" height="6" rx="1" />
      </svg>
    );
  }

  if (type === "dental") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C8.5 2 5 4 5 9c0 2.5 1.5 5 2.5 7 .5 1 1 2 1 3 0 1.5 1 3 2 3s3-1.5 3-3c0-1 .5-2 1-3 1-2 2.5-4.5 2.5-7 0-5-3.5-7-7-7z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
