import React from 'react'

import { SearchBar as antdSearchBar } from 'antd-mobile'

import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'

const StyledSearchBar = styled(antdSearchBar)<{ isSupperSearchBar: boolean }>`
  .am-search-input {
    border-radius: 30px;
    height: 40px;
  }

  &.am-search {
    ${(props) =>
      props.isSupperSearchBar
        ? `    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 4px 20px 0px #0000001A;
`
        : `background-color: transparent;`}
  }

  .am-search-input .am-search-synthetic-ph {
    height: 40px;
    line-height: 40px;
  }

  .am-search-input .am-search-clear {
    padding: 12.5px;
  }
  .am-search-input input[type='search'] {
    height: 40px;
  }
`

function SearchBar({
  placeholder,
  value,
  onChange,
  isSupperSearchBar,
}: {
  placeholder: string
  value: string
  onChange: (input: string) => void
  isSupperSearchBar?: boolean
}) {
  return (
    <StyledSearchBar
      isSupperSearchBar={isSupperSearchBar ?? false}
      placeholder={placeholder}
      cancelText=" "
      value={value}
      onChange={onChange}
    />
  )
}

export default SearchBar
