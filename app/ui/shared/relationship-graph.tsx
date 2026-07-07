import Link from "next/link";
import clsx from "clsx";
import type { RelationshipProfile } from "@/app/lib/arda-experience";

type RelationshipGraphProps = {
  profile: RelationshipProfile;
  compact?: boolean;
  tone?: "dark" | "light";
};

export default function RelationshipGraph({
  profile,
  compact = false,
  tone = "dark",
}: RelationshipGraphProps) {
  const isDark = tone === "dark";

  return (
    <section
      className={clsx(
        "overflow-hidden rounded-lg border",
        isDark
          ? "border-[#D6A526]/30 bg-[#101214]/92 text-[#F5F7EF] shadow-2xl shadow-black/30"
          : "border-[#1B1D18]/10 bg-[#F5F0DF] text-[#1B1D18] shadow-xl shadow-black/10",
      )}
    >
      <div className={clsx("border-b px-4 py-4", isDark ? "border-[#F5F7EF]/12" : "border-[#1B1D18]/10")}>
        <p className={clsx("text-xs uppercase tracking-[0.22em]", isDark ? "text-[#D6A526]" : "text-[#B23A48]")}>
          관계도
        </p>
        <h2 className={clsx("mt-2 font-semibold leading-tight", compact ? "text-xl" : "text-2xl")}>
          {profile.title}
        </h2>
        <p className={clsx("mt-2 text-sm leading-6", isDark ? "text-[#F5F7EF]/68" : "text-[#1B1D18]/65")}>
          {profile.subtitle}
        </p>
      </div>

      <div className={clsx("grid gap-4 p-4", compact ? "grid-cols-1" : "lg:grid-cols-[0.9fr_1.1fr]")}>
        <div className="relative min-h-[220px]">
          <div
            className={clsx(
              "absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center text-sm font-semibold leading-5",
              isDark
                ? "border-[#D6A526] bg-[#D6A526] text-[#101214]"
                : "border-[#274B3D] bg-[#274B3D] text-[#F5F0DF]",
            )}
          >
            {profile.center}
          </div>

          {profile.nodes.slice(0, 5).map((node, index) => {
            const positions = [
              "left-2 top-2",
              "right-2 top-8",
              "bottom-2 left-6",
              "bottom-8 right-4",
              "left-1/2 top-0 -translate-x-1/2",
            ];

            const content = (
              <div
                className={clsx(
                  "min-w-[6rem] rounded-md border px-3 py-2 text-xs leading-5 transition",
                  isDark
                    ? "border-[#F5F7EF]/15 bg-[#F5F7EF]/8 hover:border-[#D6A526]/60"
                    : "border-[#1B1D18]/10 bg-white/55 hover:border-[#274B3D]/50",
                )}
              >
                <p className="font-semibold">{node.name}</p>
                <p className={clsx(isDark ? "text-[#F5F7EF]/58" : "text-[#1B1D18]/55")}>{node.role}</p>
              </div>
            );

            return (
              <div className={clsx("absolute", positions[index])} key={`${node.name}-${node.role}`}>
                {node.href ? (
                  <Link href={`/detail/${node.href}`} aria-label={`${node.name} 상세 기록으로 이동`}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>

        <div>
          <p className={clsx("text-sm leading-7", isDark ? "text-[#F5F7EF]/76" : "text-[#1B1D18]/72")}>
            {profile.summary}
          </p>

          <div className="mt-4 space-y-2">
            {profile.links.slice(0, compact ? 4 : 6).map((link) => (
              <div
                className={clsx(
                  "flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-xs",
                  isDark ? "border-[#F5F7EF]/12 bg-black/10" : "border-[#1B1D18]/10 bg-white/45",
                )}
                key={`${link.from}-${link.to}-${link.label}`}
              >
                <span className="min-w-0 truncate">{link.from}</span>
                <span className={clsx("flex-none", isDark ? "text-[#D6A526]" : "text-[#B23A48]")}>
                  {link.label}
                </span>
                <span className="min-w-0 truncate text-right">{link.to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
