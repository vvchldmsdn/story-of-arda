import type { ArdaEraMap } from "@/app/lib/arda-experience";

export default function EraBrief({ era }: { era: ArdaEraMap }) {
  return (
    <section className="rounded-lg border border-[#D6A526]/30 bg-[#101214]/92 p-4 text-[#F5F7EF] shadow-2xl shadow-black/30">
      <p className="text-xs uppercase tracking-[0.22em] text-[#D6A526]">{era.era}</p>
      <h2 className="mt-2 text-xl font-semibold leading-tight">{era.title}</h2>
      <p className="mt-1 text-sm text-[#F5F7EF]/55">{era.period}</p>
      <p className="mt-3 text-sm leading-6 text-[#F5F7EF]/72">{era.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {era.focus.map((item) => (
          <span
            className="rounded-full border border-[#F5F7EF]/14 bg-[#F5F7EF]/8 px-3 py-1 text-xs text-[#F5F7EF]/74"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
