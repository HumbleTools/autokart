import { DbRecipeWithId } from '../../../dataServices/RecipeService'
import { Action } from '../write/WriteRecipeReducer'

export const initialState = {
  searchResults: null as unknown as DbRecipeWithId[],
  triggerSearch: true
}

export type SearchRecipeState = typeof initialState

const ON_SEARCHRESULTS_FETCHED = 'ON_SEARCHRESULTS_FETCHED'
export const getOnSearchResultsFetchedAction: (results: DbRecipeWithId[]) => Action<DbRecipeWithId[]> =
    results => ({
      type: ON_SEARCHRESULTS_FETCHED,
      data: results
    })
export const onSearchResultsFetched = (state: SearchRecipeState, action: Action<DbRecipeWithId[]>) => {
  return {
    ...state,
    searchResults: action.data,
    triggerSearch: false
  }
}

const ON_TRIGGERSEARCH_CHANGED = 'ON_TRIGGERSEARCH_CHANGED'
export const getOnTriggerSearchChangedAction: (trigger: boolean) => Action<boolean> =
    trigger => ({
      type: ON_TRIGGERSEARCH_CHANGED,
      data: trigger
    })
export const onTriggerSearchChanged = (state: SearchRecipeState, action: Action<boolean>) => {
  return {
    ...state,
    triggerSearch: action.data,
    searchResults: action.data
      ? null as unknown as DbRecipeWithId[]
      : state.searchResults
  }
}

export const reducer: (state: SearchRecipeState, action: Action<any>) => SearchRecipeState =
    (state, action) => {
      switch (action.type) {
        case ON_SEARCHRESULTS_FETCHED:
          return onSearchResultsFetched(state, action)
        case ON_TRIGGERSEARCH_CHANGED:
          return onTriggerSearchChanged(state, action)
        default:
          throw new Error(`Action type ${action.type} unknown !`)
      }
    }
