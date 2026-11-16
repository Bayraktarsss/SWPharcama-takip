import { useEffect, useState } from 'react'

/**
 * useState gibi çalışır, ancak değeri tarayıcının LocalStorage alanında saklar.
 * Sayfa yenilendiğinde veriler kaybolmaz.
 *
 * @param {string} anahtar  LocalStorage anahtarı
 * @param {*} baslangicDegeri  Kayıt yoksa kullanılacak değer
 */
export function useLocalStorage(anahtar, baslangicDegeri) {
  const [deger, setDeger] = useState(() => {
    try {
      const kayit = window.localStorage.getItem(anahtar)
      return kayit !== null ? JSON.parse(kayit) : baslangicDegeri
    } catch {
      // Bozuk JSON veya erişim engeli (gizli sekme vb.) durumunda varsayılan değere dön
      return baslangicDegeri
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(anahtar, JSON.stringify(deger))
    } catch {
      // Depolama dolu ya da engelli olabilir; uygulama yine de bellekte çalışmaya devam eder
    }
  }, [anahtar, deger])

  return [deger, setDeger]
}
