import React, { ReactChild, ReactChildren, useState } from 'react'

import styled from 'styled-components'

import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setEditOrderNumber } from '../../store/supper/action'
import { RootState } from '../../store/types'

const MainContainer = styled.div`
  margin: 0.5rem 1rem;
`

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
`

const NumberContainer = styled.div<{ isClicked?: boolean }>`
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  border: 1px black solid;
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin: 1rem;
  background-color: ${(props) => (props.isClicked ? '#002642' : 'white')};
`

const NumberText = styled.text<{ isClicked?: boolean }>`
  margin: auto;
  font-size: 21px;
  font-family: 'Inter';
  color: ${(props) => (props.isClicked ? 'white' : '#002642')};
`

const TitleText = styled.text<{ isClicked?: boolean }>`
  text-decoration: ${(props) => (props.isClicked ? 'underline' : 'none')};
  margin: auto 0;
  font-weight: 500;
  font-size: 21px;
  font-family: 'Inter';
  color: #002642;
`

const ArrowContainer = styled.div`
  margin: auto 0.5rem;
  font-size: 18px;
`

const ChildContainer = styled.div`
  margin: auto;
  width: 85vw;
  height: fit-content;
  padding: 0 0.5rem;
`

type Props = {
  isOpen?: boolean
  number: number
  title: string
  children?: ReactChild | ReactChild[] | ReactChildren | ReactChildren[]
}

export const BubbleSection = (props: Props) => {
  const { editOrderNumber } = useSelector((state: RootState) => state.supper)
  const [isClicked, setIsClicked] = useState(props.isOpen ?? props.number === editOrderNumber)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isClicked) dispatch(setEditOrderNumber(props.number))
  }, [isClicked])

  useEffect(() => {
    setIsClicked(props.isOpen ?? false)
  }, [props.isOpen])

  const arrowIcon = isClicked ? <CaretUpOutlined /> : <CaretDownOutlined />
  return (
    <MainContainer>
      <SubContainer>
        <NumberContainer
          onClick={() => {
            setIsClicked(true)
          }}
          isClicked={isClicked}
        >
          <NumberText isClicked={isClicked}>{props.number}</NumberText>
        </NumberContainer>
        <TitleText
          onClick={() => {
            setIsClicked(true)
          }}
          isClicked={isClicked}
        >
          {props.title}
        </TitleText>
        <ArrowContainer
          onClick={() => {
            setIsClicked(true)
          }}
        >
          {arrowIcon}
        </ArrowContainer>
      </SubContainer>
      {isClicked && <ChildContainer>{props.children}</ChildContainer>}
    </MainContainer>
  )
}
