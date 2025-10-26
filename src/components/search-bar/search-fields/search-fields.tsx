import { LocationField } from './location-field'
import { CategoryField } from './category-field'
import { PriceField } from './price-field'
import { SearchButton } from './search-button'

interface SearchFieldsProps {
  onSearch: () => void
  isLoading: boolean
}

export function SearchFields({ onSearch, isLoading }: SearchFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-100">
      {/* Location Field */}
      <div className="bg-white p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <LocationField />
      </div>

      {/* Property Type Field */}
      <div className="bg-white p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <CategoryField />
      </div>

      {/* Price Field */}
      <div className="bg-white p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <PriceField />
      </div>

      {/* Search Button */}
      <SearchButton onSearch={onSearch} isLoading={isLoading} />
    </div>
  )
}
