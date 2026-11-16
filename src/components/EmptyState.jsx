export default function EmptyState({ tur, onOrnekYukle, onFiltreTemizle }) {
  if (tur === 'filtre') {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 px-6 py-10 text-center">
        <p className="text-3xl" aria-hidden="true">🔍</p>
        <p className="mt-2 font-medium text-slate-700">Filtreye uyan harcama bulunamadı.</p>
        <button
          type="button"
          onClick={onFiltreTemizle}
          className="mt-3 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
        >
          Filtreleri temizle
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 px-6 py-12 text-center">
      <p className="text-5xl" aria-hidden="true">🧾</p>
      <h3 className="mt-3 text-lg font-semibold text-slate-800">Henüz harcama eklemedin</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
        Soldaki formu kullanarak ilk harcamanı ekleyebilir ya da uygulamayı hızlıca denemek için örnek verileri
        yükleyebilirsin.
      </p>
      <button
        type="button"
        onClick={onOrnekYukle}
        className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
      >
        Örnek verileri yükle
      </button>
    </div>
  )
}
