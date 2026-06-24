"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';

export default function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 shadow-md shadow-orange-500/40 flex items-center justify-center">
            <span className="text-white text-sm font-bold">EQ</span>
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tighter">
            Eat<span className="text-orange-500">Quick</span>.
          </span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-8 text-[13px] font-bold tracking-widest text-slate-500 uppercase items-center">
            <li><Link href="/" className="hover:text-orange-600 transition-colors">Home</Link></li>
            <li><Link href="/menus" className="hover:text-orange-600 transition-colors">Menu</Link></li>
            <li><Link href="/make-your-own-salad" className="hover:text-orange-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-orange-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Make Your Own</Link></li>
            <li><Link href="/our-recipes" className="hover:text-orange-600 transition-colors">Recipes</Link></li>
            <li><Link href="/contact" className="hover:text-orange-600 transition-colors">Contact</Link></li>
            <li>
              {isPending ? (
                <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-full"></div>
              ) : session?.user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-5 py-2.5 rounded-full hover:shadow-md hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5 font-bold text-xs"
                >
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">
                    👤
                  </div>
                  <span>{session.user.name?.split(" ")[0] || "Account"}</span>
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-orange-500/30 hover:-translate-y-0.5 inline-block"
                >
                  Log In
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}