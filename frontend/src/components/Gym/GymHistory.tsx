import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { getGymHistory } from '../../store/gym/action'
import { RootState } from '../../store/types'
import { unixToFormattedTimeNoSeconds } from '../../common/unixToFormattedTimeNoSeconds'

const Container = styled.div`
  padding: 0 10% 0 8%;
  background: #fff;
`

const Date = styled.p`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;

  color: #000000;

  padding-top: 5%;
  margin: 0;
`

const Content = styled.label`
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;

  color: #000000;
  margin: 0;
  padding: 8% 5% 1em 0;
`

const HistoryContainer = styled.div`
  padding-bottom: 8%;
`

const ContentRow = styled.div`
  display: flex;
  align-items: flex-end;
`

const Status = styled.div<{ status: string }>`
  width: 4px;
  height: 49px;
  background: ${(props) =>
    props.status === 'OPENED' ? `#58b994` : props.status === 'CLOSED' ? `#F37562` : `transparent`};
  border-radius: 2px;
  margin-top: 0.5em;
  margin-right: 4%;
  margin-bottom: 0.25em;
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
          <HistoryContainer key={entry.date}>
            <Date>{entry.date}</Date>
            {entry.details.map((user) => (
              <ContentRow key={user.requesttime}>
                <Content>{unixToFormattedTimeNoSeconds(user.requesttime)}</Content>
                <Status status={user.statusChange} />
                <Content>@{user.userDetails}</Content>
              </ContentRow>
            ))}
          </HistoryContainer>
        ))}
    </Container>
  )
}

export default GymHistory
