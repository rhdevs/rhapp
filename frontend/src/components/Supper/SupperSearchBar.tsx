import CaretDownOutlined from '@ant-design/icons/lib/icons/CaretDownOutlined'
import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { V1_RED } from '../../common/colours'
import { Dropdown, Menu } from 'antd'
import SearchBar from '../Mobile/SearchBar'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchedSupperGroups, setSearchValue } from '../../store/supper/action'
import { RootState } from '../../store/types'

const MainContainer = styled.div`
  display: grid;
  grid-column-gap: 10px;
  grid-template-columns: min-content 1fr;
  width: 80vw;
  justify-content: center;
  margin: 10px auto;
  align-items: center;
`

const FilterContainer = styled.div``

const FilterComponent = styled.div`
  box-shadow: 0px 4px 20px 0px #0000001a;
  background-color: ${V1_RED};
  padding: 5px 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: fit-content;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 22px;
  color: white;
  white-space: pre;
`

const StyledDropdown = styled(Dropdown)`
  #ant-menu-item-selected {
    color: red;
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: black;
  }
`

const SearchBarContainer = styled.div``

type Props = {
  placeholder?: string
  value?: string
  onChange?: (input: string) => void
}

export const SupperSearchBar = (props: Props) => {
  const dispatch = useDispatch()
  // const [searchValue, setSearchValue] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [filter, setFilter] = useState('All')
  const filterCategories = ['All', 'Restaurants', 'Group Name', 'Owner Name']
  const { searchValue } = useSelector((state: RootState) => state.supper)
  const content = (
    <>
      <Menu>
        {filterCategories.map((category, index) => (
          <Menu.Item
            key={index}
            onClick={() => {
              setIsVisible(false)
              setFilter(category)
            }}
          >
            {category}
          </Menu.Item>
        ))}
      </Menu>
    </>
  )

  const carrotArrow = () => {
    if (isVisible) {
      return <CaretDownOutlined style={{ paddingLeft: '3px', transform: 'rotate(180deg)' }} />
    }
    return <CaretDownOutlined style={{ paddingLeft: '3px' }} />
  }

  const onFilterClick = () => {
    setIsVisible(!isVisible)
  }

  // useEffect(() => {
  //   dispatch(set)
  // }, [isVisible])

  const onChange = (input: string) => {
    console.log(input)
    dispatch(setSearchValue(input))
    dispatch(getSearchedSupperGroups(input))
  }

  return (
    <MainContainer>
      <FilterContainer>
        <StyledDropdown visible={isVisible} placement="bottomRight" overlay={content} trigger={['click']}>
          <FilterComponent onClick={onFilterClick}>
            {filter} {carrotArrow()}
          </FilterComponent>
        </StyledDropdown>
      </FilterContainer>
      <SearchBarContainer>
        <SearchBar isSupperSearchBar placeholder="Search" value={searchValue} onChange={onChange} />
      </SearchBarContainer>
    </MainContainer>
  )
}
