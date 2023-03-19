import React from 'react'
import styled from 'styled-components'

import SearchIcon from '../../assets/searchIcon.svg'

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 8px;
`

const StyledButton = styled.img`
  width: 18.75px;
  max-height: 18.75px;
`
const StyledBox = styled.div`
  box-sizing: border-box;
  background: #e4e0e091;
  border-radius: 20px;
  width: 300px;
  height: 35px;
  display: flex;
  align-items: center;
`
const TextContainer = styled.div`
  padding-left: 10px;
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: #807d7d;
  line-height: 20px;
`
const SearchBar = ({ text }: { text?: string }) => {
  return (
    <SearchContainer>
      <StyledBox>
        <TextContainer>{text}</TextContainer>
      </StyledBox>
      <StyledButton src={SearchIcon}></StyledButton>
    </SearchContainer>
  )
}

export default SearchBar
