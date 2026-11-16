// Her kategori için rozet (badge) sınıfları ve grafik rengi.
// Tailwind sınıfları derleme sırasında taranabilmesi için tam metin olarak yazılmıştır.
export const KATEGORILER = [
  { ad: 'Market', ikon: '🛒', rozet: 'bg-emerald-100 text-emerald-800 ring-emerald-200', renk: '#10b981' },
  { ad: 'Ulaşım', ikon: '🚌', rozet: 'bg-sky-100 text-sky-800 ring-sky-200', renk: '#0ea5e9' },
  { ad: 'Faturalar', ikon: '💡', rozet: 'bg-amber-100 text-amber-800 ring-amber-200', renk: '#f59e0b' },
  { ad: 'Kira', ikon: '🏠', rozet: 'bg-violet-100 text-violet-800 ring-violet-200', renk: '#8b5cf6' },
  { ad: 'Eğlence', ikon: '🎬', rozet: 'bg-pink-100 text-pink-800 ring-pink-200', renk: '#ec4899' },
  { ad: 'Sağlık', ikon: '💊', rozet: 'bg-rose-100 text-rose-800 ring-rose-200', renk: '#f43f5e' },
  { ad: 'Eğitim', ikon: '📚', rozet: 'bg-indigo-100 text-indigo-800 ring-indigo-200', renk: '#6366f1' },
  { ad: 'Diğer', ikon: '📦', rozet: 'bg-slate-200 text-slate-700 ring-slate-300', renk: '#64748b' },
]

export function kategoriBul(ad) {
  return KATEGORILER.find((k) => k.ad === ad) ?? KATEGORILER[KATEGORILER.length - 1]
}
