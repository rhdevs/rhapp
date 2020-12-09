import React from 'react'

import { SearchBar } from 'antd-mobile'

import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'

const StyledSearchBar = styled(SearchBar)`
  .am-search-input {
    border-radius: 30px;
  }

  &.am-search {
    background-color: transparent;
  }
  width: 45vw;
`

function NewSearchBar() {
  return <StyledSearchBar placeholder="Search" cancelText=" " />
}

export default NewSearchBar
