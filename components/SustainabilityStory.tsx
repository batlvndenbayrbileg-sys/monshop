import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

const INGREDIENTS = [
  { n: "01", title: "Витамин C", desc: "Арьс гялалзуулагч хүчирхэг антиоксидант." },
  { n: "02", title: "Hyaluronic хүчил", desc: "Чийг хадгалах байгалийн молекул." },
  { n: "03", title: "Niacinamide", desc: "Том нүх багасгах, толбо арилгах." },
  { n: "04", title: "Retinol", desc: "Үрчлээ багасгах, нөхөн сэргээх." },
];

export function SustainabilityStory() {
  return (
    <section className="bg-bg-soft py-20 lg:py-28 overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gradient-to-br from-bg-blush to-brand-blush">
            <Image
              src="/banner.png"
              alt="Natural ingredients"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-contain p-8"
            />
            <div className="absolute bottom-4 left-4 bg-white rounded-full px-4 py-2 text-xs font-semibold text-brand-pink">
              ✦ 100% Vegan
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <div className="eyebrow text-brand-pink mb-4">— Найрлага</div>
            <h2 className="font-serif text-4xl lg:text-5xl tracking-tight leading-[1.05] mb-6">
              Чанартай <em className="italic text-brand-pink">найрлага</em>,
              <br />
              шинжлэх ухаанаар батлагдсан.
            </h2>
            <p className="text-ink-muted text-base lg:text-lg leading-relaxed mb-10 max-w-xl">
              Бид зөвхөн dermatologist шалгасан, эмчилгээнд батлагдсан найрлагуудыг ашигладаг.
              Хатуу горимоор сонгож, цэвэр байдал, аюулгүй байдалд итгэлтэй ханд.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {INGREDIENTS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="font-serif text-brand-pink text-sm mb-2">{p.n}</div>
                  <div className="font-semibold text-lg mb-2">{p.title}</div>
                  <div className="text-sm text-ink-muted leading-relaxed">{p.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="mt-10">
              <Link
                href="/ingredients"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-pink link-reveal"
              >
                Бүх найрлагыг үзэх <span>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
