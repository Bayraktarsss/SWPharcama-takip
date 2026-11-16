import { useEffect, useMemo, useState } from 'react'
import BudgetCard from './components/BudgetCard.jsx'
import CategoryBreakdown from './components/CategoryBreakdown.jsx'
import EmptyState from './components/EmptyState.jsx'
import ExpenseForm from './components/ExpenseForm.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import Filters from './components/Filters.jsx'
import Header from './components/Header.jsx'
import SummaryCards from './components/SummaryCards.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { ayAnahtari, ayFormatla, bugununTarihi, paraFormatla, yeniId } from './utils/format.js'
import { ornekHarcamalarOlustur } from './utils/sampleData.js'
import { aylikToplam, kategoriDagilimi, mevcutAylar, toplamHesapla } from './utils/stats.js'

const BOS_FILTRE = { kategori: 'tumu', ay: 'tumu', arama: '' }

export default function App() {
  // Kalıcı veriler (LocalStorage)
  const [harcamalar, setHarcamalar] = useLocalStorage('harcama-takip:harcamalar', [])
  const [butce, setButce] = useLocalStorage('harcama-takip:aylik-butce', 0)

  // Geçici arayüz durumu
  const [filtre, setFiltre] = useState(BOS_FILTRE)
  const [duzenlenen, setDuzenlenen] = useState(null)
  const [bildirim, setBildirim] = useState('')

  useEffect(() => {
    if (!bildirim) return
    const zamanlayici = setTimeout(() => setBildirim(''), 3000)
    return () => clearTimeout(zamanlayici)
  }, [bildirim])

  const buAy = ayAnahtari(bugununTarihi())

  // Tarihe göre (yeniden eskiye) sıralı liste
  const siraliHarcamalar = useMemo(
    () => [...harcamalar].sort((a, b) => b.tarih.localeCompare(a.tarih) || (b.olusturma ?? 0) - (a.olusturma ?? 0)),
    [harcamalar],
  )

  const aylar = useMemo(() => mevcutAylar(harcamalar), [harcamalar])

  const ayaGore = useMemo(
    () => (filtre.ay === 'tumu' ? siraliHarcamalar : siraliHarcamalar.filter((h) => ayAnahtari(h.tarih) === filtre.ay)),
    [siraliHarcamalar, filtre.ay],
  )

  const filtrelenmis = useMemo(() => {
    const arama = filtre.arama.trim().toLocaleLowerCase('tr-TR')
    return ayaGore.filter(
      (h) =>
        (filtre.kategori === 'tumu' || h.kategori === filtre.kategori) &&
        (!arama || h.aciklama.toLocaleLowerCase('tr-TR').includes(arama)),
    )
  }, [ayaGore, filtre.kategori, filtre.arama])

  const toplam = toplamHesapla(harcamalar)
  const buAyToplam = aylikToplam(harcamalar, buAy)
  const genelDagilim = useMemo(() => kategoriDagilimi(harcamalar), [harcamalar])
  const ayDagilimi = useMemo(() => kategoriDagilimi(ayaGore), [ayaGore])
  const filtreToplami = toplamHesapla(filtrelenmis)

  function harcamaKaydet(veri) {
    if (duzenlenen) {
      setHarcamalar((liste) => liste.map((h) => (h.id === duzenlenen.id ? { ...h, ...veri } : h)))
      setDuzenlenen(null)
      setBildirim('Harcama güncellendi.')
    } else {
      setHarcamalar((liste) => [...liste, { id: yeniId(), ...veri, olusturma: Date.now() }])
      setBildirim('Harcama eklendi.')
    }
  }

  function duzenlemeyeBasla(harcama) {
    setDuzenlenen(harcama)
    document.getElementById('harcama-formu')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => document.getElementById('aciklama')?.focus({ preventScroll: true }), 300)
  }

  function harcamaSil(harcama) {
    if (!window.confirm(`"${harcama.aciklama}" (${paraFormatla(harcama.tutar)}) silinsin mi?`)) return
    setHarcamalar((liste) => liste.filter((h) => h.id !== harcama.id))
    if (duzenlenen?.id === harcama.id) setDuzenlenen(null)
    setBildirim('Harcama silindi.')
  }

  function ornekVerileriYukle() {
    setHarcamalar(ornekHarcamalarOlustur())
    if (!butce) setButce(20000)
    setBildirim('Örnek veriler yüklendi.')
  }

  function tumVerileriSil() {
    if (!window.confirm('Tüm harcamalar ve bütçe ayarı kalıcı olarak silinecek. Emin misin?')) return
    setHarcamalar([])
    setButce(0)
    setDuzenlenen(null)
    setFiltre(BOS_FILTRE)
    setBildirim('Tüm veriler silindi.')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#harcama-formu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-indigo-700 focus:shadow"
      >
        Forma atla
      </a>
      <Header kayitSayisi={harcamalar.length} />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        <SummaryCards
          toplam={toplam}
          kayitSayisi={harcamalar.length}
          buAyToplam={buAyToplam}
          buAy={buAy}
          enCok={genelDagilim[0]}
        />

        <div className="grid items-start gap-6 lg:grid-cols-3">
          <aside className="space-y-6 lg:col-span-1">
            <ExpenseForm
              key={duzenlenen?.id ?? 'yeni'}
              duzenlenen={duzenlenen}
              onKaydet={harcamaKaydet}
              onIptal={() => setDuzenlenen(null)}
            />
            <BudgetCard butce={butce} setButce={setButce} buAyToplam={buAyToplam} buAy={buAy} />
          </aside>

          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200" aria-labelledby="liste-baslik">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="liste-baslik" className="text-lg font-semibold text-slate-900">
                  Harcamalar
                </h2>
                {harcamalar.length > 0 && (
                  <p className="text-sm text-slate-500">
                    {filtrelenmis.length} kayıt · <span className="font-semibold text-slate-900">{paraFormatla(filtreToplami)}</span>
                  </p>
                )}
              </div>

              {harcamalar.length === 0 ? (
                <EmptyState tur="bos" onOrnekYukle={ornekVerileriYukle} />
              ) : (
                <>
                  <Filters filtre={filtre} setFiltre={setFiltre} aylar={aylar} />
                  <div className="mt-4">
                    {filtrelenmis.length === 0 ? (
                      <EmptyState tur="filtre" onFiltreTemizle={() => setFiltre(BOS_FILTRE)} />
                    ) : (
                      <ExpenseList
                        harcamalar={filtrelenmis}
                        onDuzenle={duzenlemeyeBasla}
                        onSil={harcamaSil}
                        duzenlenenId={duzenlenen?.id}
                      />
                    )}
                  </div>
                </>
              )}
            </section>

            <CategoryBreakdown
              dagilim={ayDagilimi}
              altBaslik={filtre.ay === 'tumu' ? 'Tüm zamanlar' : ayFormatla(filtre.ay)}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <p>Veriler yalnızca bu tarayıcıda (LocalStorage) saklanır. · React + Vite + Tailwind CSS</p>
          {harcamalar.length > 0 && (
            <button type="button" onClick={tumVerileriSil} className="rounded px-2 py-1 font-medium text-rose-600 hover:bg-rose-50">
              Tüm verileri sil
            </button>
          )}
        </div>
      </footer>

      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center px-4">
        {bildirim && (
          <p className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">{bildirim}</p>
        )}
      </div>
    </div>
  )
}
