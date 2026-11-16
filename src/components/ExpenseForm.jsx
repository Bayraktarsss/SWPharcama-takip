import { useState } from 'react'
import { KATEGORILER } from '../utils/categories.js'
import { bugununTarihi } from '../utils/format.js'

function bosForm() {
  return { aciklama: '', tutar: '', kategori: KATEGORILER[0].ad, tarih: bugununTarihi() }
}

function dogrula(form) {
  const hatalar = {}
  if (!form.aciklama.trim()) hatalar.aciklama = 'Lütfen bir açıklama girin.'
  else if (form.aciklama.trim().length > 80) hatalar.aciklama = 'Açıklama en fazla 80 karakter olabilir.'
  const tutar = Number(String(form.tutar).replace(',', '.'))
  if (form.tutar === '' || !Number.isFinite(tutar) || tutar <= 0) hatalar.tutar = "Tutar 0'dan büyük olmalı."
  if (!form.tarih) hatalar.tarih = 'Lütfen bir tarih seçin.'
  return hatalar
}

const girdiSinifi =
  'mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:outline-none'

function alanSinifi(hata) {
  return `${girdiSinifi} ${hata ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`
}

/**
 * Hem yeni harcama ekleme hem de mevcut harcamayı düzenleme için kullanılır.
 * Düzenleme modunda üst bileşen `key` değiştirerek formu yeniden başlatır.
 */
export default function ExpenseForm({ duzenlenen, onKaydet, onIptal }) {
  const [form, setForm] = useState(() =>
    duzenlenen
      ? { aciklama: duzenlenen.aciklama, tutar: String(duzenlenen.tutar), kategori: duzenlenen.kategori, tarih: duzenlenen.tarih }
      : bosForm(),
  )
  const [hatalar, setHatalar] = useState({})

  function degistir(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (hatalar[name]) setHatalar((h) => ({ ...h, [name]: undefined }))
  }

  function gonder(e) {
    e.preventDefault()
    const yeniHatalar = dogrula(form)
    setHatalar(yeniHatalar)
    if (Object.keys(yeniHatalar).length > 0) return
    onKaydet({
      aciklama: form.aciklama.trim(),
      tutar: Math.round(Number(String(form.tutar).replace(',', '.')) * 100) / 100,
      kategori: form.kategori,
      tarih: form.tarih,
    })
    if (!duzenlenen) setForm((f) => ({ ...bosForm(), kategori: f.kategori, tarih: f.tarih }))
  }

  const duzenlemeModu = Boolean(duzenlenen)

  return (
    <section
      id="harcama-formu"
      aria-labelledby="form-baslik"
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ${duzenlemeModu ? 'ring-2 ring-amber-400' : 'ring-slate-200'}`}
    >
      <h2 id="form-baslik" className="text-lg font-semibold text-slate-900">
        {duzenlemeModu ? '✏️ Harcamayı Düzenle' : '➕ Yeni Harcama'}
      </h2>
      <form onSubmit={gonder} noValidate className="mt-4 space-y-4">
        <div>
          <label htmlFor="aciklama" className="text-sm font-medium text-slate-700">
            Açıklama
          </label>
          <input
            id="aciklama"
            name="aciklama"
            type="text"
            value={form.aciklama}
            onChange={degistir}
            placeholder="Örn. Market alışverişi"
            maxLength={80}
            aria-invalid={Boolean(hatalar.aciklama)}
            aria-describedby={hatalar.aciklama ? 'aciklama-hata' : undefined}
            className={alanSinifi(hatalar.aciklama)}
          />
          {hatalar.aciklama && (
            <p id="aciklama-hata" className="mt-1 text-xs text-rose-600">
              {hatalar.aciklama}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="tutar" className="text-sm font-medium text-slate-700">
              Tutar (₺)
            </label>
            <input
              id="tutar"
              name="tutar"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={form.tutar}
              onChange={degistir}
              placeholder="0,00"
              aria-invalid={Boolean(hatalar.tutar)}
              aria-describedby={hatalar.tutar ? 'tutar-hata' : undefined}
              className={alanSinifi(hatalar.tutar)}
            />
            {hatalar.tutar && (
              <p id="tutar-hata" className="mt-1 text-xs text-rose-600">
                {hatalar.tutar}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="tarih" className="text-sm font-medium text-slate-700">
              Tarih
            </label>
            <input
              id="tarih"
              name="tarih"
              type="date"
              value={form.tarih}
              onChange={degistir}
              aria-invalid={Boolean(hatalar.tarih)}
              aria-describedby={hatalar.tarih ? 'tarih-hata' : undefined}
              className={alanSinifi(hatalar.tarih)}
            />
            {hatalar.tarih && (
              <p id="tarih-hata" className="mt-1 text-xs text-rose-600">
                {hatalar.tarih}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="kategori" className="text-sm font-medium text-slate-700">
            Kategori
          </label>
          <select id="kategori" name="kategori" value={form.kategori} onChange={degistir} className={alanSinifi(false)}>
            {KATEGORILER.map((k) => (
              <option key={k.ad} value={k.ad}>
                {k.ikon} {k.ad}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
              duzenlemeModu ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {duzenlemeModu ? 'Değişiklikleri Kaydet' : 'Harcama Ekle'}
          </button>
          {duzenlemeModu && (
            <button
              type="button"
              onClick={onIptal}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50"
            >
              Vazgeç
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
