# Harcama Takip — Planlama Dokümanı

Bu doküman, yönergenin **4. adımı (Yapay zeka ile planlama)** kapsamında hazırlanmıştır. Uygulamanın fikri, ekranları ve veri modeli, kodlamaya başlamadan önce yapay zeka asistanı **Claude (Claude Code)** ile birlikte konuşularak planlanmış; çıkan karar ve notlar aşağıda özetlenmiştir.

---

## 1. Fikir

**İstem:** "Eğitimde öğrendiğim React, LocalStorage ve Tailwind CSS konularını birlikte kullanabileceğim, günlük hayatta işe yarayan küçük bir web uygulaması fikri öner. Yönergedeki Vue harcama formu örneğinden ilham alabilirsin."

Değerlendirilen fikirler:

| Fikir | Artı | Eksi | Karar |
|-------|------|------|-------|
| Kelime defteri | Basit CRUD | Hesaplama / özet ekranı az | ❌ |
| Kitap kanban panosu | Görsel olarak çekici | Sürükle-bırak ek kütüphane gerektirir | ❌ |
| **Harcama takip** | CRUD + filtreleme + hesaplama + grafik bir arada, herkesin işine yarar | — | ✅ |

**Seçilen fikir:** Kişisel harcamaları kaydeden, kategorilere ayıran, aylık bütçe limitine göre uyaran ve verileri tarayıcıda (LocalStorage) saklayan tek sayfalık bir uygulama.

### Hedef kullanıcı ve ihtiyaçlar
- Harcamasını hızlıca (3–4 alanla) kaydetmek isteyen öğrenci / çalışan.
- "Bu ay ne kadar harcadım?", "Paranın çoğu nereye gidiyor?" sorularına tek bakışta cevap.
- Hesap açmadan, internete veri göndermeden çalışması.

## 2. Özellik listesi (MVP)

1. Harcama ekleme formu: açıklama, tutar, kategori, tarih (doğrulamalı).
2. Harcama listesi: masaüstünde tablo, mobilde kart görünümü; kategoriler renkli rozetlerle.
3. Düzenleme ve silme (silmeden önce onay).
4. Üstte özet kartları: toplam tutar, bu ayki harcama, en çok harcanan kategori.
5. Filtreleme: kategoriye, aya ve açıklamada metin aramasına göre.
6. Kategori dağılımı: ek grafik kütüphanesi olmadan, saf CSS ile yatay çubuklar.
7. Aylık bütçe limiti ve ilerleme çubuğu (yeşil → turuncu %80 → kırmızı %100).
8. Tüm veriler LocalStorage'da kalıcı (`useLocalStorage` özel hook'u).
9. Boş ekranda "Örnek verileri yükle" düğmesi (değerlendirme ve tanıtım için).
10. Türk lirası biçimlendirme (`Intl.NumberFormat('tr-TR', { currency: 'TRY' })`).

Kapsam dışı bırakılanlar: kullanıcı hesabı, sunucu/veritabanı, çoklu para birimi, CSV dışa aktarma (ileride eklenebilir).

## 3. Ekranlar / Arayüz düzeni

Uygulama tek sayfadan oluşur; bölümler şöyle planlandı:

```
┌──────────────────────────────────────────────────────────┐
│ Header: logo (₺) · "Harcama Takip" · kayıt sayısı        │
├──────────────────────────────────────────────────────────┤
│ [Toplam Harcama]  [Bu Ayki Harcama]  [En Çok Kategori]   │  ← SummaryCards
├───────────────────┬──────────────────────────────────────┤
│ Yeni Harcama /    │ Harcamalar                           │
│ Düzenle formu     │  Filtreler: kategori · ay · arama    │
│ (ExpenseForm)     │  Tablo / kart listesi (ExpenseList)  │
│                   │  veya boş durum (EmptyState)         │
│ Aylık Bütçe       ├──────────────────────────────────────┤
│ (BudgetCard)      │ Kategori Dağılımı (CategoryBreakdown)│
├───────────────────┴──────────────────────────────────────┤
│ Footer: LocalStorage notu · "Tüm verileri sil"           │
└──────────────────────────────────────────────────────────┘
```

- **Mobil (< 768px):** tüm bölümler tek sütunda alt alta; tablo yerine kart listesi.
- **Tablet:** özet kartları 2 sütun, liste tablo görünümü.
- **Masaüstü (≥ 1024px):** sol sütunda form + bütçe, sağda liste + dağılım.

### Durumlar
- **Boş durum:** henüz kayıt yoksa açıklama ve "Örnek verileri yükle" düğmesi.
- **Filtre sonucu boş:** "Filtreye uyan harcama bulunamadı" + "Filtreleri temizle".
- **Düzenleme modu:** form turuncu çerçeve alır, başlık "Harcamayı Düzenle" olur, listede ilgili satır vurgulanır.
- **Bildirim:** ekle / güncelle / sil işlemlerinden sonra altta kısa süreli mesaj (`aria-live`).

## 4. Veri modeli

### Harcama nesnesi

```js
{
  id: "3f2b9c1e-...",        // crypto.randomUUID()
  aciklama: "Market alışverişi", // string, 1–80 karakter
  tutar: 1245.9,              // number, > 0, 2 ondalık basamağa yuvarlanır
  kategori: "Market",         // KATEGORILER listesindeki adlardan biri
  tarih: "2026-11-11",        // "YYYY-MM-DD" (input[type=date] biçimi)
  olusturma: 1762857600000    // Date.now(), aynı gündeki kayıtları sıralamak için
}
```

### LocalStorage anahtarları

| Anahtar | Tür | Açıklama |
|---------|-----|----------|
| `harcama-takip:harcamalar` | `Harcama[]` (JSON) | Tüm harcama kayıtları |
| `harcama-takip:aylik-butce` | `number` | Aylık bütçe limiti (0 = belirlenmedi) |

### Kategoriler (sabit liste)

Market 🛒 · Ulaşım 🚌 · Faturalar 💡 · Kira 🏠 · Eğlence 🎬 · Sağlık 💊 · Eğitim 📚 · Diğer 📦

Her kategori için bir rozet rengi (Tailwind sınıfları) ve grafik rengi (hex) `src/utils/categories.js` dosyasında tutulur.

### Türetilen (hesaplanan) değerler
Bu değerler saklanmaz, her render'da harcama listesinden hesaplanır:
- Toplam tutar, bu ayın toplamı, filtrelenmiş toplam
- Kategori dağılımı (toplam ve oran, büyükten küçüğe)
- Veride bulunan aylar listesi (ay filtresi için)

## 5. Bileşen ağacı

```
App
├── Header
├── SummaryCards
├── ExpenseForm          (ekleme + düzenleme)
├── BudgetCard
├── Filters
├── ExpenseList          (tablo + mobil kartlar)
│   └── CategoryBadge
├── EmptyState
└── CategoryBreakdown
```

Yardımcı dosyalar: `hooks/useLocalStorage.js`, `utils/format.js` (para/tarih), `utils/stats.js` (hesaplamalar), `utils/categories.js`, `utils/sampleData.js`.

## 6. Teknik kararlar

- **React + Vite:** hızlı geliştirme sunucusu, kolay `dist` çıktısı → Netlify'a doğrudan yüklenebilir.
- **Tailwind CSS v4 (`@tailwindcss/vite`):** ayrı yapılandırma dosyası gerektirmeden hızlı, tutarlı ve duyarlı (responsive) stil.
- **Grafik kütüphanesi yok:** dağılım çubukları saf CSS (`width: %`) ile çizildi; paket boyutu küçük kaldı.
- **Erişilebilirlik:** her form alanının `label`'ı, hata mesajları `aria-describedby` ile bağlı, ilerleme çubuğu `role="progressbar"`, odak halkaları belirgin, "Forma atla" bağlantısı.
- **Yayın:** `netlify.toml` ile derleme komutu `npm run build`, yayın klasörü `dist`.
