import React from 'react'

import { SearchBar as antdSearchBar } from 'antd-mobile'

import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'

const StyledSearchBar = styled(antdSearchBar)`
  .am-search-input {
    border-radius: 30px;
  }

  &.am-search {
    background-color: transparent;
  }
`

function SearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string
  value: string
  onChange: (input: string) => void
}) {
  return <StyledSearchBar placeholder={placeholder} cancelText=" " value={value} onChange={onChange} />
}

export default SearchBar
