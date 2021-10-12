import { useRouter } from 'next/router'
import React, { useState } from 'react'
// TODO: replace with lighter alternative and save 30Kb of gz bundle size
// @ts-ignore
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import useApi from '~/concepts/a314/hooks/useApi'
import { api } from '~/config'
import { Thing } from '~/types'

type Props = {
  maxCount?: number
}

export const TypeaheadSearchField: React.FC<Props> = ({ maxCount = 10 }) => {
  const [{ data, loading }, setQuery] = useApi(api.searchThings)
  const router = useRouter()
  const options = data?.items || []
  const [selected, setSelected] = useState([])

  const onSelection = (selected: Thing[]) => {
    console.log('onSelection', selected)
    const thing = selected[0]
    if (!thing) return
    const prefix = { category: 'c', entity: 'e' }[thing.type]
    router.push(`/${prefix}/${thing.slug}-${thing.id}`)
    setSelected([])
  }

  //FIX: remove style
  return (
    <div className="input-group input-group-sm" style={{ width: '150px' }}>
      <AsyncTypeahead
        id="searchField"
        isLoading={loading}
        caseSensitive={false}
        ignoreDiacritics={true}
        labelKey="content"
        minLength={0}
        onSearch={(q) => setQuery({ q })}
        onChange={onSelection}
        selected={selected}
        options={options}
        placeholder="Category or product"
        searchText="Loading..."
        delay={100}
        useCache={true}
        renderMenuItemChildren={(option: Thing) => (
          <div>
            <span>{option.content}</span>
          </div>
        )}
      />
    </div>
  )
}
