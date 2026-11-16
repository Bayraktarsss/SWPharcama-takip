import { kategoriBul } from '../utils/categories.js'

export default function CategoryBadge({ kategori }) {
  const k = kategoriBul(kategori)
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${k.rozet}`}
    >
      <span aria-hidden="true">{k.ikon}</span>
      {k.ad}
    </span>
  )
}
