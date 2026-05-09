import { useState, type FormEvent } from 'react'
import './SearchBar.css'

interface SearchBarProps {
  /** Current committed search query (controlled). */
  value: string
  /** Called when the user submits via Enter or Search button. */
  onSearch: (query: string) => void
}

export default function SearchBar({ value, onSearch }: SearchBarProps) {
  const [draft, setDraft] = useState(value)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch(draft.trim())
  }

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <label htmlFor="search-input" className="visually-hidden">
        Search products
      </label>
      <input
        id="search-input"
        type="text"
        className="search-bar__input"
        placeholder="Search by name, colour or type"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button
        type="submit"
        className="search-button-container search-bar__button"
      >
        Search
      </button>
    </form>
  )
}
