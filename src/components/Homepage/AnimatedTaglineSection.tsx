export function AnimatedTaglineSection() {
  return (
    <section className="relative w-full bg-[#4F0A22] py-8 sm:py-10 md:py-14 md:min-h-[105vh] lg:min-h-[130vh] px-2 sm:px-4 flex items-center justify-center overflow-hidden">
      <div className="mx-auto w-full flex flex-col items-center justify-center text-center font-heinz font-black uppercase tracking-tighter lg:gap-6">
        {/* Baris 1 */}
        <h2
          className="text-[clamp(3.5rem,13vw,13rem)] leading-[0.80] text-[#D7001A] origin-center my-[0.12em] lg:my-[0.18em]"
          style={{ transform: 'scaleY(1.3)' }}
        >
          MADE TO
        </h2>

        {/* Baris 2 (putih, sedikit lebih kecil di tengah) */}
        <h2
          className="text-[clamp(3rem,10.5vw,10rem)] leading-[0.80] text-white origin-center my-[0.12em] lg:my-[0.18em]"
          style={{ transform: 'scaleY(1.3)' }}
        >
          BE SHARE
        </h2>

        {/* Baris 3 */}
        <h2
          className="text-[clamp(3.5rem,13vw,13rem)] leading-[0.80] text-[#D7001A] origin-center my-[0.12em] lg:my-[0.18em]"
          style={{ transform: 'scaleY(1.3)' }}
        >
          MADE TO LAST
        </h2>
      </div>
    </section>
  )
}