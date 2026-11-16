export default function Header({ kayitSayisi }) {
  return (
    <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15 text-2xl font-bold ring-1 ring-white/30"
            aria-hidden="true"
          >
            ₺
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Harcama Takip</h1>
            <p className="text-sm text-indigo-100">Kişisel harcamalarını kaydet, bütçeni kontrol et.</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-white/15 px-3 py-1 text-sm font-medium ring-1 ring-white/25 sm:inline-block">
          {kayitSayisi} kayıt
        </span>
      </div>
    </header>
  )
}
