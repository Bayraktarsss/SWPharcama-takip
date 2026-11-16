import { useState } from 'react'
import { ayFormatla, paraFormatla } from '../utils/format.js'

export default function BudgetCard({ butce, setButce, buAyToplam, buAy }) {
  const [duzenleniyor, setDuzenleniyor] = useState(false)
  const [girdi, setGirdi] = useState('')

  const oran = butce > 0 ? buAyToplam / butce : 0
  const yuzde = Math.round(oran * 100)
  const kalan = butce - buAyToplam

  let cubukRengi = 'bg-emerald-500'
  let durumRengi = 'text-emerald-700'
  let durum = 'Bütçe kontrol altında'
  if (oran >= 1) {
    cubukRengi = 'bg-rose-500'
    durumRengi = 'font-semibold text-rose-600'
    durum = 'Bütçe aşıldı!'
  } else if (oran >= 0.8) {
    cubukRengi = 'bg-amber-500'
    durumRengi = 'font-semibold text-amber-600'
    durum = 'Bütçe sınırına yaklaşıldı'
  }

  function kaydet(e) {
    e.preventDefault()
    const sayi = Number(String(girdi).replace(',', '.'))
    if (Number.isFinite(sayi) && sayi >= 0) {
      setButce(sayi)
      setDuzenleniyor(false)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200" aria-labelledby="butce-baslik">
      <div className="flex items-center justify-between gap-2">
        <h2 id="butce-baslik" className="text-lg font-semibold text-slate-900">
          Aylık Bütçe
        </h2>
        {!duzenleniyor && (
          <button
            type="button"
            onClick={() => {
              setGirdi(butce ? String(butce) : '')
              setDuzenleniyor(true)
            }}
            className="rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
          >
            {butce > 0 ? 'Değiştir' : 'Belirle'}
          </button>
        )}
      </div>
      <p className="text-sm text-slate-500">{ayFormatla(buAy)}</p>

      {duzenleniyor ? (
        <form onSubmit={kaydet} className="mt-4 flex flex-wrap gap-2">
          <label htmlFor="butce-girdi" className="sr-only">
            Aylık bütçe limiti (₺)
          </label>
          <input
            id="butce-girdi"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            autoFocus
            value={girdi}
            onChange={(e) => setGirdi(e.target.value)}
            placeholder="Örn. 20000"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          />
          <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Kaydet
          </button>
          <button
            type="button"
            onClick={() => setDuzenleniyor(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            İptal
          </button>
        </form>
      ) : butce > 0 ? (
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="font-semibold text-slate-900">{paraFormatla(buAyToplam)}</span>
            <span className="text-slate-500">/ {paraFormatla(butce)}</span>
          </div>
          <div
            className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Aylık bütçe kullanımı"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(yuzde, 100)}
            aria-valuetext={`Bütçenin yüzde ${yuzde} kadarı kullanıldı`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${cubukRengi}`}
              style={{ width: `${Math.min(yuzde, 100)}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-xs">
            <span className={durumRengi}>{durum}</span>
            <span className="text-slate-500">%{yuzde}</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {kalan >= 0 ? (
              <>
                Kalan: <strong className="text-slate-900">{paraFormatla(kalan)}</strong>
              </>
            ) : (
              <>
                Aşım: <strong className="text-rose-600">{paraFormatla(-kalan)}</strong>
              </>
            )}
          </p>
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          Henüz bir aylık limit belirlemedin. Bir limit gir, bu ayki harcamaların limite göre takip edilsin.
        </p>
      )}
    </section>
  )
}
