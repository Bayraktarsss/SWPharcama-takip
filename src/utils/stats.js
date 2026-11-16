import { ayAnahtari } from './format.js'

export function toplamHesapla(harcamalar) {
  return harcamalar.reduce((t, h) => t + Number(h.tutar), 0)
}

export function aylikToplam(harcamalar, ay) {
  return toplamHesapla(harcamalar.filter((h) => ayAnahtari(h.tarih) === ay))
}

/** Kategorilere göre toplamlar, büyükten küçüğe sıralı: [{ kategori, toplam, oran }] */
export function kategoriDagilimi(harcamalar) {
  const toplamlar = {}
  for (const h of harcamalar) {
    toplamlar[h.kategori] = (toplamlar[h.kategori] ?? 0) + Number(h.tutar)
  }
  const genelToplam = toplamHesapla(harcamalar)
  return Object.entries(toplamlar)
    .map(([kategori, toplam]) => ({
      kategori,
      toplam,
      oran: genelToplam > 0 ? toplam / genelToplam : 0,
    }))
    .sort((a, b) => b.toplam - a.toplam)
}

/** Verideki tüm ayları yeniden eskiye sıralı döndürür: ["2026-11", "2026-10", ...] */
export function mevcutAylar(harcamalar) {
  return [...new Set(harcamalar.map((h) => ayAnahtari(h.tarih)))].sort().reverse()
}
