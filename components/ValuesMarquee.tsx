const VALUES = [
  "Гар хийц",
  "Байгалийн материал",
  "Карбон саармаг",
  "Удаан эдэлгээтэй",
  "Этик хариуцлагатай",
  "Монголд хийсэн",
  "Цөөн тооны үйлдвэрлэл",
];

export function ValuesMarquee() {
  const items = [...VALUES, ...VALUES, ...VALUES];
  return (
    <section className="py-12 lg:py-20 bg-bg-primary border-y border-line-subtle overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.map((v, i) => (
          <span
            key={i}
            className="px-10 lg:px-16 font-serif text-3xl lg:text-5xl tracking-tight flex items-center gap-10 lg:gap-16 text-ink-faint hover:text-ink transition-colors duration-500"
          >
            <em className="italic">{v}</em>
            <span className="text-brand-champagne text-xl lg:text-2xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
