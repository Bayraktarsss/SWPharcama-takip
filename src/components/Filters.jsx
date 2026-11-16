import { KATEGORILER } from '../utils/categories.js'
import { ayFormatla } from '../utils/format.js'

const secimSinifi =
  'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none'

export default function Filters({ filtre, setFiltre, aylar }) {
  const aktif = filtre.kategori !== 'tumu' || filtre.ay !== 'tumu' || filtre.arama !== ''

  function degistir(e) {
    const { name, value } = e.target
    setFiltre((f) => ({ ...f, [name]: value }))
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.3fr_auto] sm:items-end" role="search" aria-label="Harcamaları filtrele">
      <div>
        <label htmlFor="filtre-kategori" className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          Kategori
        </label>
        <select id="filtre-kategori" name="kategori" value={filtre.kategori} onChange={degistir} className={secimSinifi}>
          <option value="tumu">Tüm kategoriler</option>
          {KATEGORILER.map((k) => (
            <option key={k.ad} value={k.ad}>
              {k.ikon} {k.ad}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filtre-ay" className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          Ay
        </label>
        <select id="filtre-ay" name="ay" value={filtre.ay} onChange={degistir} className={secimSinifi}>
          <option value="tumu">Tüm aylar</option>
          {aylar.map((ay) => (
            <option key={ay} value={ay}>
              {ayFormatla(ay)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filtre-arama" className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          Ara
        </label>
        <input
          id="filtre-arama"
          name="arama"
          type="search"
          value={filtre.arama}
          onChange={degistir}
          placeholder="Açıklamada ara…"
          className={secimSinifi}
        />
      </div>
      <button
        type="button"
        disabled={!aktif}
        onClick={() => setFiltre({ kategori: 'tumu', ay: 'tumu', arama: '' })}
        className="rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:ring-slate-200 disabled:hover:bg-transparent"
      >
        Temizle
      </button>
    </div>
  )
}
