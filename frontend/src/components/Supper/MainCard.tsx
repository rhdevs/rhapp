import React, { MouseEventHandler, ReactChild, ReactChildren } from 'react'

import styled from 'styled-components'
import editIcon from '../../assets/SupperEditIcon.svg'

const MainContainer = styled.div<{
  flexDirection?: string | undefined
  minHeight?: string | undefined
  margin?: string | undefined
  borderRadius?: string | undefined
  padding?: string | undefined
}>`
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  margin: ${(props) => props.margin ?? '23px'};
  min-height: ${(props) => props.minHeight ?? '70px'};
  border-radius: ${(props) => props.borderRadius ?? '20px'};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  padding: ${(props) => props.padding ?? '15px'};
  flex-direction: ${(props) => props.flexDirection ?? ''};
`

const EditIcon = styled.img<{ editIconSize?: string | undefined }>`
  position: absolute;
  margin: 5px 20px;
  right: 0;
  height: ${(props) => props.editIconSize ?? 'auto'};
`

interface AuxProps {
  children?: ReactChild | ReactChild[] | ReactChildren | ReactChildren[]
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'initial' | 'inherit'
  minHeight?: string
  isEditable?: boolean | undefined
  editIconSize?: string
  margin?: string | undefined
  padding?: string | undefined
  borderRadius?: string | undefined
  editOnClick?: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined
  onClick?: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined
}

export const MainCard = (props: AuxProps) => {
  return (
    <MainContainer
      onClick={props.onClick as MouseEventHandler<HTMLDivElement>}
      minHeight={props.minHeight}
      flexDirection={props.flexDirection}
      margin={props.margin}
      borderRadius={props.borderRadius}
      padding={props.padding}
    >
      {props.children}
      {props.isEditable && (
        <EditIcon
          onClick={props.editOnClick as MouseEventHandler<HTMLDivElement>}
          editIconSize={props.editIconSize}
          src={editIcon}
          alt="Edit Icon"
        />
      )}
    </MainContainer>
  )
}
