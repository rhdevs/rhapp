import React, { ReactChild, ReactChildren, useState } from 'react'

import styled from 'styled-components'

import CaretDownOutlined from '@ant-design/icons/lib/icons/CaretDownOutlined'
import CaretUpOutlined from '@ant-design/icons/lib/icons/CaretUpOutlined'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { V1_BLUE } from '../../common/colours'
import { setEditOrderNumber } from '../../store/supper/action/setter'

const MainContainer = styled.div`
  margin: 0.5rem 1rem;
`

const TopContainer = styled.div`
  display: grid;
  grid-template-rows: min-content;
  grid-template-columns: min-content 1fr min-content;
  grid-gap: 10px;
  margin-bottom: 5px;
`

const NumberContainer = styled.div<{ isClicked?: boolean }>`
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  border: 1px black solid;
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin: 5px 0 5px 1rem;
  background-color: ${(props) => (props.isClicked ? V1_BLUE : 'white')};
`

const NumberText = styled.text<{ isClicked?: boolean }>`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  margin: auto;
  color: ${(props) => (props.isClicked ? 'white' : V1_BLUE)};
`

const TitleText = styled.text<{ isClicked?: boolean }>`
  text-decoration: ${(props) => (props.isClicked ? 'underline' : 'none')};
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: ${V1_BLUE};
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 5px;
  align-items: center;
  margin: auto 0;
`

const ArrowContainer = styled.div`
  margin: auto;
  font-size: 18px;
`

const ChildContainer = styled.div<{ canHide?: boolean; isClicked?: boolean }>`
  ${(props) =>
    (props.canHide ?? false) && !props.isClicked
      ? `
width: 0;
height: 0;
display: none;
`
      : `margin: auto;
width: 85vw;
height: fit-content;
padding: 0 0.5rem;`}
`

const RedText = styled.p`
  margin: 0;
  color: #ff4d4f;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  white-space: nowrap;
`

type Props = {
  isOpen?: boolean
  canHide?: boolean //component can be hidden, not removed
  number: number
  title: string
  children?: ReactChild | ReactChild[] | ReactChildren | ReactChildren[]
  error?: boolean
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

  const error = () => {
    return <RedText> • Error</RedText>
  }

  return (
    <MainContainer>
      <TopContainer>
        <NumberContainer
          onClick={() => {
            setIsClicked(true)
          }}
          isClicked={isClicked}
        >
          <NumberText isClicked={isClicked}>{props.number}</NumberText>
        </NumberContainer>
        <TextContainer>
          <TitleText
            onClick={() => {
              setIsClicked(true)
            }}
            isClicked={isClicked}
          >
            {props.title}
          </TitleText>
          {props.error && error()}
        </TextContainer>
        <ArrowContainer
          onClick={() => {
            setIsClicked(true)
          }}
        >
          {arrowIcon}
        </ArrowContainer>
      </TopContainer>
      <ChildContainer canHide={props.canHide ?? false} isClicked={isClicked}>
        {props.canHide ? props.children : isClicked && props.children}
      </ChildContainer>
    </MainContainer>
  )
}
