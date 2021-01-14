import { Reducer } from 'redux'
import { ActionTypes, LAUNDRY_ACTIONS, Location, WashingMachine } from './types'

const initialState = {
  isLoading: false,
  isEdit: false,
  locations: [],
  blocks: [],
  selectedBlock: null,
  levels: [],
  selectedLevel: null,
  filteredMachines: [],
  selectedMachine: null,
}

type State = {
  isLoading: boolean
  isEdit: boolean
  locations: Location[]
  blocks: string[]
  selectedBlock: string | null
  levels: string[]
  selectedLevel: string | null
  filteredMachines: WashingMachine[]
  selectedMachine: WashingMachine | null
}

export const laundry: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case LAUNDRY_ACTIONS.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      }
    }

    case LAUNDRY_ACTIONS.GET_LOCATION_LIST: {
      return {
        ...state,
        locations: action.locations,
        blocks: action.blocks,
        levels: action.levels,
      }
    }

    case LAUNDRY_ACTIONS.SET_BLOCK_LEVEL_SELECTIONS: {
      return {
        ...state,
        selectedBlock: action.selectedBlock,
        selectedLevel: action.selectedLevel,
      }
    }

    case LAUNDRY_ACTIONS.SET_FILTERED_MACHINES: {
      return {
        ...state,
        filteredMachines: action.filteredMachines,
      }
    }

    case LAUNDRY_ACTIONS.SET_SELECTED_MACHINE: {
      return {
        ...state,
        selectedMachine: action.selectedMachine,
      }
    }

    case LAUNDRY_ACTIONS.SET_EDIT_MODE: {
      return {
        ...state,
        isEdit: action.isEdit,
      }
    }
    default:
      return state
  }
}
