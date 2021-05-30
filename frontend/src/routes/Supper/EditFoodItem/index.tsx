import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { AddUpdateCartButton } from '../../../components/Supper/AddUpdateCartButton'
import { MainCard } from '../../../components/Supper/MainCard'
import { QuantityTracker } from '../../../components/Supper/QuantityTracker'
import { getEditFoodItem, updateEditFoodItem } from '../../../store/supper/action'
import { Food } from '../../../store/supper/types'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: #fafaf4;
  display: flex;
  flex-direction: column;
`
const FoodItemHeader = styled.p`
  font-weight: bold;
  font-size: 24px;
  line-height: 14px;
`

const SectionHeader = styled.p`
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

const Spacer = styled.div`
  height: 24px;
`

// const OptionText = styled.p`
//   font-style: normal;
//   font-weight: 200;
//   font-size: 14px;
//   line-height: 14px;
// `

const TextInput = styled.input`
  width: 100%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
`

type FormValues = {
  Sides: string
  Drinks: string
  others: string
  comments: string
  quantity: number
  cancelAction: string
}

const EditFoodItem = () => {
  const dispatch = useDispatch()

  const { isLoading, editFoodItem, count } = useSelector((state: RootState) => state.supper)
  const params = useParams<{ supperGroupId: string; itemId: string }>()
  const { register, handleSubmit } = useForm<FormValues>()
  const onSubmit = () => {
    handleSubmit((data: Food) => {
      console.log('Save changes!')
      console.log(data)
      dispatch(updateEditFoodItem(data, params.itemId))
    })()
  }

  useEffect(() => {
    dispatch(getEditFoodItem(params.supperGroupId, params.itemId))
  }, [dispatch])

  return (
    <MainContainer>
      <TopNavBar title="Edit Item" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <MainCard flexDirection="column" isEditable={false} editIconSize="0rem" padding="25px">
          <FoodItemHeader>{editFoodItem?.foodName}</FoodItemHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            {editFoodItem?.custom?.map((section) => {
              return (
                <>
                  <SectionHeader>{section.title}</SectionHeader>
                  {section.options.map((option, key) => {
                    return (
                      <>
                        <input key={key} {...register('Sides', { required: true })} type="radio" value={option.name} />
                        <br />
                      </>
                    )
                  })}
                  <Spacer />
                </>
              )
            })}

            <SectionHeader>If this product is not available</SectionHeader>
            <input {...register('cancelAction', { required: true })} type="radio" value={'contact'} name="Contact" />
            <br />
            <input {...register('cancelAction', { required: true })} type="radio" value="Cancel" label="Cancel" />
            <Spacer />

            <TextInput
              defaultValue={editFoodItem?.comments}
              {...register('comments')}
              placeholder="Additional comments e.g. BBQ Sauce"
            />
            <Spacer />
            <QuantityTracker default={editFoodItem?.quantity || count} center={true} />
            <Spacer />
            <AddUpdateCartButton
              onClick={onSubmit}
              update
              currentTotal={editFoodItem?.foodPrice?.toString() || '0.00'}
            />
          </form>
        </MainCard>
      )}
    </MainContainer>
  )
}

export default EditFoodItem
