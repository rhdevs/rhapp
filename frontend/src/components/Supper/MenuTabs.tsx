import React, { useEffect } from 'react'
import 'antd/dist/antd.css'
import styled from 'styled-components'
import { Radio } from 'antd'
import { useDispatch } from 'react-redux'
import { V1_BACKGROUND, V1_RED } from '../../common/colours'
import { setMenuTabKey } from '../../store/supper/action/setter'

const MainContainer = styled.div`
  overflow: auto;
  white-space: nowrap;
  margin: 15px 0px;
  position: sticky;
  left: 0;
  top: 4.4rem;
  padding-bottom: 10px;
  background: ${V1_BACKGROUND};
`

const ToggleTabsContainer = styled(Radio.Group)`
  .ant-radio-button-wrapper:hover {
    color: ${V1_RED};
  }

  .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child {
    border-right-color: ${V1_RED};
    border-left-color: ${V1_RED};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover:before {
    color: white;
    background: ${V1_RED};
    border-color: ${V1_RED};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):before {
    color: white;
    background: ${V1_RED};
    border-color: ${V1_RED};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
    border-color: ${V1_RED};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: white;
    background: ${V1_RED};
    border-color: ${V1_RED};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled): hover {
    color: white;
    background: ${V1_RED};
    border-color: ${V1_RED};
  }

  .ant-radio-button-wrapper {
    font-family: Inter;
  }
`

const TextContainer = styled(Radio.Button)`
  font-size: 16px;
`

type Props = {
  menuSections?: string[] | undefined
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const MenuTabs = (props: Props) => {
  const dispatch = useDispatch()

  let menuTab = 'All'

  useEffect(() => {
    dispatch(setMenuTabKey(menuTab))
  }, [dispatch])

  return (
    <MainContainer>
      <ToggleTabsContainer defaultValue="All">
        {props.menuSections ? (
          ['All'].concat(props.menuSections).map((section, idx) => (
            <>
              <TextContainer
                key={idx}
                value={section}
                onClick={() => {
                  menuTab = section
                  dispatch(setMenuTabKey(section))
                }}
              >
                {section}
              </TextContainer>
            </>
          ))
        ) : (
          <></>
        )}
      </ToggleTabsContainer>
    </MainContainer>
  )
}
