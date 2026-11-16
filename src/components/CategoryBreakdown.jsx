import { kategoriBul } from '../utils/categories.js'
import { paraFormatla } from '../utils/format.js'

/** Saf CSS ile çizilen kategori dağılımı: üstte yığılmış tek çubuk, altta kategori satırları. */
export default function CategoryBreakdown({ dagilim, altBaslik }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200" aria-labelledby="dagilim-baslik">
      <h2 id="dagilim-baslik" className="text-lg font-semibold text-slate-900">
        Kategori Dağılımı
      </h2>
      <p className="text-sm text-slate-500">{altBaslik}</p>

      {dagilim.length === 0 ? (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Gösterilecek harcama yok.</p>
      ) : (
        <>
          <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            {dagilim.map((d) => (
              <div
                key={d.kategori}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                style={{ width: `${d.oran * 100}%`, backgroundColor: kategoriBul(d.kategori).renk }}
                title={`${d.kategori}: %${(d.oran * 100).toFixed(1)}`}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-3">
            {dagilim.map((d) => {
              const k = kategoriBul(d.kategori)
              const yuzde = (d.oran * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })
              return (
                <li key={d.kategori}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: k.renk }} aria-hidden="true" />
                      {k.ikon} {k.ad}
                    </span>
                    <span className="text-right text-slate-600 tabular-nums">
                      {paraFormatla(d.toplam)} <span className="text-xs text-slate-400">(%{yuzde})</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${d.oran * 100}%`, backgroundColor: k.renk }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}
