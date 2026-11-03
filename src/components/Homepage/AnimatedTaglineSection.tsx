export function AnimatedTaglineSection() {
  return (
    <section className="relative w-full bg-[#4F0A22] py-8 sm:py-10 md:py-14 px-2 sm:px-4 flex items-center justify-center overflow-hidden">
      <div className="mx-auto w-full flex flex-col items-center justify-center text-center font-heinz font-black uppercase tracking-tighter">
        {/* Baris 1 */}
        <h2
          className="text-[clamp(3.5rem,13vw,13rem)] leading-[0.85] text-[#D7001A] origin-center"
          style={{ transform: 'scaleY(1.3)', marginBlock: '0.12em' }}
        >
          MADE TO
        </h2>

        {/* Baris 2 (putih, sedikit lebih kecil di tengah) */}
        <h2
          className="text-[clamp(3rem,10.5vw,10rem)] leading-[0.85] text-white origin-center"
          style={{ transform: 'scaleY(1.3)', marginBlock: '0.12em' }}
        >
          BE SHARE
        </h2>

        {/* Baris 3 */}
        <h2
          className="text-[clamp(3.5rem,13vw,13rem)] leading-[0.85] text-[#D7001A] origin-center"
          style={{ transform: 'scaleY(1.3)', marginBlock: '0.12em' }}
        >
          MADE TO LAST
        </h2>
      </div>
    </section>
  )
}