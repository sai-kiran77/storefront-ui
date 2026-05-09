import { useState } from 'react'
import {
  EMPTY_FILTERS,
  isEmptyFilters,
  type Filters,
} from '../../types/filters'
import type { Product } from '../../types/product'
import './FilterPanel.css'

interface FilterPanelProps {
  products: Product[]
  filters: Filters
  onChange: (next: Filters) => void
}

/** Derive sorted, unique values for a string field on the product list. */
function uniqueValues<K extends keyof Product>(
  products: Product[],
  key: K,
): string[] {
  const set = new Set<string>()
  for (const p of products) set.add(String(p[key]))
  return Array.from(set).sort()
}

export default function FilterPanel({
  products,
  filters,
  onChange,
}: FilterPanelProps) {
  const genders = uniqueValues(products, 'gender')
  const colours = uniqueValues(products, 'color')
  const types = uniqueValues(products, 'type')

  const [mobileOpen, setMobileOpen] = useState(false)

  const toggle = (
    key: 'genders' | 'colours' | 'types',
    value: string,
  ) => {
    const current = filters[key]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const updatePrice = (key: 'minPrice' | 'maxPrice', value: string) => {
    const parsed = value === '' ? null : Number(value)
    onChange({ ...filters, [key]: Number.isNaN(parsed) ? null : parsed })
  }

  const hasActiveFilters = !isEmptyFilters(filters)
  const activeCount =
    filters.genders.length +
    filters.colours.length +
    filters.types.length +
    (filters.minPrice !== null ? 1 : 0) +
    (filters.maxPrice !== null ? 1 : 0)

  return (
    <aside
      className={`filter-panel ${mobileOpen ? 'filter-panel--open' : ''}`}
      aria-label="Filters"
    >
      <div className="filter-panel__header">
        <button
          type="button"
          className="filter-panel__toggle"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
        >
          <h2 className="filter-panel__title">
            Filters
            {activeCount > 0 && (
              <span className="filter-panel__active-count">{activeCount}</span>
            )}
          </h2>
          <i
            className="fa-solid fa-chevron-down filter-panel__chevron"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          className="filter-panel__clear"
          onClick={() => onChange(EMPTY_FILTERS)}
          disabled={!hasActiveFilters}
        >
          Clear all
        </button>
      </div>

      <div className="filter-panel__body">
        <section className="filter-panel__group">
          <h3 className="filter-panel__label">Gender</h3>
          <div className="filter-panel__options">
            {genders.map((g) => (
              <label key={g} className="filter-panel__option">
                <input
                  type="checkbox"
                  checked={filters.genders.includes(g)}
                  onChange={() => toggle('genders', g)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="filter-panel__group">
          <h3 className="filter-panel__label">Colour</h3>
          <div className="filter-panel__options filter-panel__options--grid">
            {colours.map((c) => (
              <label key={c} className="filter-panel__option">
                <input
                  type="checkbox"
                  checked={filters.colours.includes(c)}
                  onChange={() => toggle('colours', c)}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="filter-panel__group">
          <h3 className="filter-panel__label">Price range</h3>
          <div className="filter-panel__price">
            <input
              type="number"
              min={0}
              placeholder="Min"
              className="filter-panel__price-input"
              value={filters.minPrice ?? ''}
              onChange={(e) => updatePrice('minPrice', e.target.value)}
              aria-label="Minimum price"
            />
            <span className="filter-panel__price-sep">–</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              className="filter-panel__price-input"
              value={filters.maxPrice ?? ''}
              onChange={(e) => updatePrice('maxPrice', e.target.value)}
              aria-label="Maximum price"
            />
          </div>
        </section>

        <section className="filter-panel__group">
          <h3 className="filter-panel__label">Type</h3>
          <div className="filter-panel__options">
            {types.map((t) => (
              <label key={t} className="filter-panel__option">
                <input
                  type="checkbox"
                  checked={filters.types.includes(t)}
                  onChange={() => toggle('types', t)}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}
