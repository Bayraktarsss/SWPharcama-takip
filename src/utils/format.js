const paraBicimi = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 1234.5 -> "₺1.234,50" */
export function paraFormatla(tutar) {
  return paraBicimi.format(Number(tutar) || 0)
}

/** "2026-11-05" -> "5 Kas 2026" */
export function tarihFormatla(isoTarih) {
  const [y, a, g] = isoTarih.split('-').map(Number)
  return new Date(y, a - 1, g).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** "2026-11" -> "Kasım 2026" */
export function ayFormatla(ayAnahtari) {
  const [y, a] = ayAnahtari.split('-').map(Number)
  const metin = new Date(y, a - 1, 1).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
  return metin.charAt(0).toLocaleUpperCase('tr-TR') + metin.slice(1)
}

/** Yerel saat dilimine göre bugünün tarihi: "YYYY-MM-DD" */
export function bugununTarihi() {
  const d = new Date()
  const ay = String(d.getMonth() + 1).padStart(2, '0')
  const gun = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${ay}-${gun}`
}

/** "2026-11-05" -> "2026-11" */
export function ayAnahtari(isoTarih) {
  return isoTarih.slice(0, 7)
}

export function yeniId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
