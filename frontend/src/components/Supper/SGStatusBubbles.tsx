import React, { useEffect } from 'react'

import styled from 'styled-components'
import { StatusSymbol } from './StatusSymbol'
import tick from '../../assets/whiteTick.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { setSelectedSupperGroupStatus } from '../../store/supper/action'
import { SupperGroupStatus } from '../../store/supper/types'

const CheckIcon = styled.img`
  margin-top: -4px;
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 80vw;
`

type Props = {
  supperGroupStatusList: SupperGroupStatus[]
}

export const SGStatusBubbles = (props: Props) => {
  const DARK_BLUE = '#002642'
  const CHECK_ICON = <CheckIcon src={tick} alt="Check Icon" />

  const { selectedSupperGroupStatus } = useSelector((state: RootState) => state.supper)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSelectedSupperGroupStatus(SupperGroupStatus.OPEN))
  }, [])

  return (
    <MainContainer>
      {props.supperGroupStatusList.map((supperGroupStatus, index) => {
        if (selectedSupperGroupStatus === supperGroupStatus) {
          return (
            <StatusSymbol
              border={DARK_BLUE}
              color="white"
              borderWidth="1px"
              backgroundColor="bluegrey"
              shadow="0px 4px 4px 0px #6b6b6b"
              key={index}
              text={supperGroupStatus}
              rightIcon={CHECK_ICON}
              fontWeight={500}
              fontSize="14px"
            />
          )
        } else {
          return (
            <StatusSymbol
              onClick={() => {
                dispatch(setSelectedSupperGroupStatus(supperGroupStatus))
              }}
              border={DARK_BLUE}
              color={DARK_BLUE}
              borderWidth="1px"
              shadow="0px 4px 4px 0px #6b6b6b"
              key={index}
              text={supperGroupStatus}
              fontWeight={500}
              fontSize="14px"
            />
          )
        }
      })}
    </MainContainer>
  )
}
