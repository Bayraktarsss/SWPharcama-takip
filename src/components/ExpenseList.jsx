import CategoryBadge from './CategoryBadge.jsx'
import { paraFormatla, tarihFormatla } from '../utils/format.js'

function IslemDugmeleri({ harcama, onDuzenle, onSil, duzenleniyor }) {
  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        onClick={() => onDuzenle(harcama)}
        aria-label={`${harcama.aciklama} harcamasını düzenle`}
        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
          duzenleniyor ? 'bg-amber-100 text-amber-800' : 'text-indigo-600 hover:bg-indigo-50'
        }`}
      >
        Düzenle
      </button>
      <button
        type="button"
        onClick={() => onSil(harcama)}
        aria-label={`${harcama.aciklama} harcamasını sil`}
        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
      >
        Sil
      </button>
    </div>
  )
}

export default function ExpenseList({ harcamalar, onDuzenle, onSil, duzenlenenId }) {
  return (
    <>
      {/* Masaüstü / tablet: tablo görünümü */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Harcama listesi</caption>
          <thead>
            <tr className="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase">
              <th scope="col" className="py-3 pr-3 font-medium">Tarih</th>
              <th scope="col" className="px-3 py-3 font-medium">Açıklama</th>
              <th scope="col" className="px-3 py-3 font-medium">Kategori</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Tutar</th>
              <th scope="col" className="py-3 pl-3 text-right font-medium">
                <span className="sr-only">İşlemler</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {harcamalar.map((h) => (
              <tr key={h.id} className={h.id === duzenlenenId ? 'bg-amber-50' : 'hover:bg-slate-50'}>
                <td className="py-3 pr-3 whitespace-nowrap text-slate-500">{tarihFormatla(h.tarih)}</td>
                <td className="px-3 py-3 font-medium text-slate-900">{h.aciklama}</td>
                <td className="px-3 py-3">
                  <CategoryBadge kategori={h.kategori} />
                </td>
                <td className="px-3 py-3 text-right font-semibold whitespace-nowrap text-slate-900 tabular-nums">
                  {paraFormatla(h.tutar)}
                </td>
                <td className="py-3 pl-3">
                  <IslemDugmeleri harcama={h} onDuzenle={onDuzenle} onSil={onSil} duzenleniyor={h.id === duzenlenenId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil: kart görünümü */}
      <ul className="space-y-3 md:hidden">
        {harcamalar.map((h) => (
          <li
            key={h.id}
            className={`rounded-xl p-4 ring-1 ${h.id === duzenlenenId ? 'bg-amber-50 ring-amber-300' : 'bg-slate-50 ring-slate-200'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium break-words text-slate-900">{h.aciklama}</p>
                <p className="mt-0.5 text-xs text-slate-500">{tarihFormatla(h.tarih)}</p>
              </div>
              <p className="shrink-0 font-semibold text-slate-900 tabular-nums">{paraFormatla(h.tutar)}</p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <CategoryBadge kategori={h.kategori} />
              <IslemDugmeleri harcama={h} onDuzenle={onDuzenle} onSil={onSil} duzenleniyor={h.id === duzenlenenId} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
