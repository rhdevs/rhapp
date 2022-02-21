import React, { useEffect } from 'react'
import { unixToFormattedTimeNoSeconds } from '../common/unixToFormattedTimeNoSeconds'
import { unixToFullDate } from '../common/unixToFullDate'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { getGymHistory } from '../store/gym/action'
import { RootState } from '../store/types'

const Container = styled.div`
  padding: 0 10% 0 8%;
`

const Date = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -0.015em;

  color: #000000;

  padding-top: 5%;
`

const Content = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -0.015em;

  color: #000000;

  padding: 8% 5% 1em 0;
`

const ContentRow = styled.div`
  display: flex;
  align-items: flex-end;
`

const Status = styled.div<{ status: string }>`
  width: 4px;
  height: 49px;
  background: ${(props) =>
    props.status == 'OPENED' ? `#58b994` : props.status == 'CLOSED' ? `#F37562` : `transparent`};
  border-radius: 2px;
  margin-top: 0.5em;
  margin-right: 4%;
  margin-bottom: 0.25em;
`

const PaddingFiller = styled.div`
  padding-top: 8%;
`

const GymHistory = () => {
  const dispatch = useDispatch()
  const { gymHistory } = useSelector((state: RootState) => state.gym)
  useEffect(() => {
    dispatch(getGymHistory())
  }, [])
  return (
    <Container>
      {gymHistory !== undefined &&
        gymHistory.map((entry) => (
          <div key={entry.date}>
            <Date>{unixToFullDate(entry.date)}</Date>
            {entry.details.map((user) => (
              <ContentRow key={user.requesttime}>
                <Content>{unixToFormattedTimeNoSeconds(user.requesttime)}</Content>
                <Status status={user.statusChange} />
                <Content>{user.userDetails}</Content>
              </ContentRow>
            ))}
            <PaddingFiller />
          </div>
        ))}
    </Container>
  )
}

export default GymHistory
