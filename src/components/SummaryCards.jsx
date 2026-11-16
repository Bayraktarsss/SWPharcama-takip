import { kategoriBul } from '../utils/categories.js'
import { ayFormatla, paraFormatla } from '../utils/format.js'

function Kart({ baslik, deger, alt, ikon, vurgu }) {
  return (
    <div className="flex h-full items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className={`grid size-12 shrink-0 place-items-center rounded-xl text-2xl ${vurgu}`} aria-hidden="true">
        {ikon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{baslik}</p>
        <p className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900">{deger}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{alt}</p>
      </div>
    </div>
  )
}

export default function SummaryCards({ toplam, kayitSayisi, buAyToplam, buAy, enCok }) {
  const enCokKategori = enCok ? kategoriBul(enCok.kategori) : null
  return (
    <section aria-label="Özet bilgiler" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Kart
        baslik="Toplam Harcama"
        deger={paraFormatla(toplam)}
        alt={`${kayitSayisi} harcama kaydı`}
        ikon="💰"
        vurgu="bg-indigo-100"
      />
      <Kart
        baslik="Bu Ayki Harcama"
        deger={paraFormatla(buAyToplam)}
        alt={ayFormatla(buAy)}
        ikon="📅"
        vurgu="bg-emerald-100"
      />
      <div className="sm:col-span-2 lg:col-span-1">
        <Kart
          baslik="En Çok Harcanan Kategori"
          deger={enCokKategori ? `${enCokKategori.ikon} ${enCokKategori.ad}` : '—'}
          alt={enCok ? `${paraFormatla(enCok.toplam)} · toplamın %${Math.round(enCok.oran * 100)} kadarı` : 'Henüz veri yok'}
          ikon="🏆"
          vurgu="bg-amber-100"
        />
      </div>
    </section>
  )
}
