import { Dispatch, GetState } from '../types'
import { ActionTypes, LAUNDRY_ACTIONS, Location, WashingMachine } from './types'
import { ENDPOINTS, DOMAIN_URL } from '../endpoints'

export const SetIsLoading = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: LAUNDRY_ACTIONS.SET_IS_LOADING, isLoading: desiredState })
}

export const getLocationList = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetIsLoading(true))
  await fetch(DOMAIN_URL.LAUNDRY + ENDPOINTS.MACHINE_LIST, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((data) => {
      const blocks = [
        ...new Set(
          data.map((item: Location) => {
            if (item.block === 7 || item.block === 8) {
              return 'Kuok'
            } else {
              return 'Block ' + item.block.toString()
            }
          }),
        ),
      ]
      dispatch({
        type: LAUNDRY_ACTIONS.GET_LOCATION_LIST,
        locations: data,
        blocks: blocks as string[],
        levels: [],
      })
      dispatch(SetIsLoading(false))
    })
}

export const SetBlockLevelSelections = (newBlock: string, newLevel: string) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch(SetIsLoading(true))
  const { locations, blocks, selectedLevel, selectedBlock } = getState().laundry

  // If only Block is selected
  if (newLevel === '') {
    newLevel = selectedLevel as string
    const filterLocationByBlock = locations.filter(
      (location) => location.block === parseInt(newBlock ? newBlock?.split(' ')[1] : ''),
    )
    const newLevelList = [...new Set(filterLocationByBlock.map((item: Location) => 'Level ' + item.level.toString()))]
    dispatch({
      type: LAUNDRY_ACTIONS.GET_LOCATION_LIST,
      locations: locations,
      blocks: blocks,
      levels: newLevelList as string[],
    })
    dispatch(SetIsLoading(false))
  } else {
    newBlock = selectedBlock as string
  }
  dispatch({
    type: LAUNDRY_ACTIONS.SET_BLOCK_LEVEL_SELECTIONS,
    selectedBlock: newBlock as string,
    selectedLevel: newLevel as string,
  })
  dispatch(SetIsLoading(false))
  dispatch(SetFilteredMachines())
}

export const SetFilteredMachines = () => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(SetIsLoading(true))
  const { selectedBlock, selectedLevel } = getState().laundry

  dispatch(SetIsLoading(true))
  let returnTable: WashingMachine[] = []
  for (let i = 0; i < 3; i++) {
    const queryBlock = selectedBlock === 'Kuok' ? 7 : selectedBlock?.split(' ')[1]
    const queryLevel = selectedBlock === 'Kuok' ? 0 : selectedLevel?.split(' ')[1]

    const queryUrl = DOMAIN_URL.LAUNDRY + ENDPOINTS.LAUNDRY_MACHINE + '?locationID=' + queryBlock + '-' + queryLevel + i
    await fetch(queryUrl, {
      method: 'GET',
      mode: 'cors',
    })
      .then((resp) => resp.json())
      .then((data) => {
        returnTable = returnTable.concat(data)
      })
  }
  dispatch({
    type: LAUNDRY_ACTIONS.SET_FILTERED_MACHINES,
    filteredMachines: returnTable,
  })
  dispatch(SetIsLoading(false))
}

export const SetSelectedMachine = (selectedMachine: WashingMachine) => async (dispatch: Dispatch<ActionTypes>) => {
  console.log(selectedMachine)
  dispatch({ type: LAUNDRY_ACTIONS.SET_SELECTED_MACHINE, selectedMachine: selectedMachine })
}

export const SetEditMode = () => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isEdit } = getState().laundry
  dispatch({ type: LAUNDRY_ACTIONS.SET_EDIT_MODE, isEdit: !isEdit })
}
