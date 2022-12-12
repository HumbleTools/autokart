import { useCallback, useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useParams } from 'react-router-dom'
import { getRecipesByWords } from '../../../dataServices/RecipeService'
import { parseTags } from '../../../tools/TagTools'
import { PlanRecipe } from '../../plan/PlanRecipe'
import { initialState, getOnSearchResultsFetchedAction, getOnTriggerSearchChangedAction, reducer } from './SearchRecipeReducer'

interface SearchFormResult {
  searchText: string
  tagSearchOnly: boolean
}

export const SearchRecipes = (props: { tagModeInit?: boolean }) => {
  const { query } = useParams()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { searchResults, triggerSearch } = state

  const { watch, register, getValues } = useForm<SearchFormResult>({
    defaultValues: {
      searchText: query ?? '',
      tagSearchOnly: !!props.tagModeInit
    }
  })
  const { searchText, tagSearchOnly } = getValues()
  console.log(watch())

  const resultsAreIn = () => {
    return searchResults?.length
  }
  const shouldLaunchSearch = useCallback(
    () => (!searchResults && !searchText) || (triggerSearch && searchText),
    [searchResults, searchText, triggerSearch]
  )
  const onFormChange = () => {
    dispatch(getOnTriggerSearchChangedAction(true))
  }

  useEffect(() => {
    if (shouldLaunchSearch()) {
      getRecipesByWords(parseTags(searchText), tagSearchOnly ? 'tags' : 'keywords')
        .then(data => {
          dispatch(getOnSearchResultsFetchedAction(data))
        })
        .finally(() => {
          dispatch(getOnTriggerSearchChangedAction(false))
        })
    }
  }, [searchText, tagSearchOnly, shouldLaunchSearch])

  return <>
        <h4 className="mt-1">Carnet de recettes</h4>
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="row">
                <div className="twelve columns">
                    <input id="searchText" className="u-full-width" type="text"
                            {...register('searchText', { onChange: onFormChange })} />
                </div>
            </div>
            <div className="row">
                <div className="six columns">
                    <input id="tagSearchOnly" type="checkbox"
                            {...register('tagSearchOnly', { onChange: onFormChange })} />
                    <label htmlFor="tagSearchOnly">recherche par tags uniquement</label>
                </div>
            </div>
        </form>
        {!resultsAreIn() && <p>Il n'y a aucun résultat.</p>}
        {resultsAreIn() && <table className="u-full-width">
            <thead>
                <tr>
                    <th>Résultats</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {searchResults.map((it, index) => <tr key={index}>
                    <td><NavLink className="no-link" to={`/view/${it.id}`}>{it.name}</NavLink></td>
                    <td className="text-right"><PlanRecipe recipeName={it.name} recipeId={it.id} /></td>
                </tr>)}
            </tbody>
        </table>}
    </>
}
