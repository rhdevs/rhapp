import React, { useEffect } from 'react'

import styled from 'styled-components'
import { StatusSymbol } from './StatusSymbol'
import tick from '../../assets/whiteTick.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { SupperGroupStatus } from '../../store/supper/types'
import { V1_BLUE } from '../../common/colours'
import { setSelectedSupperGroupStatus } from '../../store/supper/action/setter'

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
  default?: SupperGroupStatus | undefined
  onlyArrivedOption?: boolean
}

export const SGStatusOptions = (props: Props) => {
  const CHECK_ICON = <CheckIcon src={tick} alt="Check Icon" />

  const { selectedSupperGroupStatus } = useSelector((state: RootState) => state.supper)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSelectedSupperGroupStatus(props.default ?? SupperGroupStatus.ORDERED))
  }, [])

  return (
    <MainContainer>
      {props.supperGroupStatusList.map((supperGroupStatus, index) => {
        if (selectedSupperGroupStatus === supperGroupStatus) {
          return (
            <StatusSymbol
              border={V1_BLUE}
              color="white"
              borderWidth="1px"
              backgroundColor="bluegrey"
              shadow
              key={index}
              text={supperGroupStatus}
              rightIcon={CHECK_ICON}
            />
          )
        } else {
          return (
            <StatusSymbol
              onClick={() => {
                dispatch(setSelectedSupperGroupStatus(supperGroupStatus))
              }}
              border={V1_BLUE}
              color={V1_BLUE}
              borderWidth="1px"
              shadow
              key={index}
              text={supperGroupStatus}
              isFaded={props.onlyArrivedOption}
            />
          )
        }
      })}
    </MainContainer>
  )
}
