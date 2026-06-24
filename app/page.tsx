import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full bg-slate-50 px-4 py-6">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center text-center overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/img/med-quinoa-salad.jpg" 
            alt="Delicious healthy salad" 
            fill 
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-white px-4 flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-medium text-xs tracking-widest uppercase">
              100% Fresh & Local
            </span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter drop-shadow-lg leading-[0.9]">
            Eat Quick<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
              Eat Healthy.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-medium text-slate-100 drop-shadow-md leading-relaxed">
            Discover our fresh salads and hot meals made with local ingredients. Fast, delicious, and customized for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link 
              href="/menus" 
              className="group relative flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 px-10 rounded-full transition-all duration-300 text-lg hover:bg-slate-50 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.8)] hover:-translate-y-1"
            >
              Explore Menu
              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link 
              href="/make-your-own-salad" 
              className="group flex items-center justify-center gap-2 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-lg border border-white/20 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 text-lg hover:-translate-y-1"
            >
              Build a Salad
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}