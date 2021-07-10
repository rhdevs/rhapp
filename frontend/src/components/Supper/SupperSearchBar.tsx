import React from 'react'

import styled from 'styled-components'
import SearchBar from '../Mobile/SearchBar'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchedSupperGroups, setSearchValue } from '../../store/supper/action'
import { RootState } from '../../store/types'

const MainContainer = styled.div`
  width: 80vw;
  justify-content: center;
  margin: 10px auto;
  align-items: center;
`

type Props = {
  placeholder?: string
  value?: string
  onChange?: (input: string) => void
}

export const SupperSearchBar = (props: Props) => {
  const dispatch = useDispatch()
  const { searchValue } = useSelector((state: RootState) => state.supper)

  const onChange = (input: string) => {
    console.log(input)
    dispatch(setSearchValue(input))
    dispatch(getSearchedSupperGroups(input))
  }

  return (
    <MainContainer>
      <SearchBar isSupperSearchBar placeholder="Search" value={searchValue} onChange={onChange} />
    </MainContainer>
  )
}
