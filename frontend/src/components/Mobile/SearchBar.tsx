import React from 'react'

import { SearchBar as antdSearchBar } from 'antd-mobile'

import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'

const StyledSearchBar = styled(antdSearchBar)`
  .am-search-input {
    border-radius: 30px;
    height: 40px;
  }

  &.am-search {
    background-color: transparent;
  }
  .am-search-input .am-search-synthetic-ph {
    height: 40px;
    line-height: 40px;
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
