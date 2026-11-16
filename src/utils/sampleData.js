import { yeniId } from './format.js'

// Bugünden "gunOnce" gün öncesinin tarihini "YYYY-MM-DD" olarak verir.
function gunOncesi(gunOnce) {
  const d = new Date()
  d.setDate(d.getDate() - gunOnce)
  const ay = String(d.getMonth() + 1).padStart(2, '0')
  const gun = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${ay}-${gun}`
}

const ORNEKLER = [
  { aciklama: 'Haftalık market alışverişi', tutar: 1245.9, kategori: 'Market', gunOnce: 1 },
  { aciklama: 'İstanbulkart dolum', tutar: 500, kategori: 'Ulaşım', gunOnce: 2 },
  { aciklama: 'Elektrik faturası', tutar: 687.35, kategori: 'Faturalar', gunOnce: 4 },
  { aciklama: 'Sinema bileti (2 kişi)', tutar: 420, kategori: 'Eğlence', gunOnce: 5 },
  { aciklama: 'Eczane', tutar: 312.5, kategori: 'Sağlık', gunOnce: 7 },
  { aciklama: 'Online React kursu', tutar: 899, kategori: 'Eğitim', gunOnce: 9 },
  { aciklama: 'Ev kirası', tutar: 15000, kategori: 'Kira', gunOnce: 11 },
  { aciklama: 'İnternet faturası', tutar: 449.9, kategori: 'Faturalar', gunOnce: 24 },
  { aciklama: 'Manav ve fırın', tutar: 386.4, kategori: 'Market', gunOnce: 30 },
  { aciklama: 'Kitap siparişi', tutar: 274, kategori: 'Eğitim', gunOnce: 36 },
]

/** Değerlendirme için hazır, tarihleri bugüne göre ayarlanmış örnek harcamalar. */
export function ornekHarcamalarOlustur() {
  return ORNEKLER.map(({ gunOnce, ...h }) => ({
    id: yeniId(),
    ...h,
    tarih: gunOncesi(gunOnce),
    olusturma: Date.now() - gunOnce * 86400000,
  }))
}
