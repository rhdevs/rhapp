import React from 'react'

import styled from 'styled-components'
import SearchBar from '../Mobile/SearchBar'
import { useDispatch, useSelector } from 'react-redux'
import { getFilteredSupperGroups, setSearchValue } from '../../store/supper/action'
import { RootState } from '../../store/types'

const MainContainer = styled.div`
  width: 100%;
`

export const SupperSearchBar = () => {
  const dispatch = useDispatch()
  const { searchValue } = useSelector((state: RootState) => state.supper)

  const onChange = (input: string) => {
    console.log(input)
    dispatch(setSearchValue(input))
    dispatch(getFilteredSupperGroups())
  }

  return (
    <MainContainer>
      <SearchBar isSupperSearchBar placeholder="Search" value={searchValue} onChange={onChange} />
    </MainContainer>
  )
}
