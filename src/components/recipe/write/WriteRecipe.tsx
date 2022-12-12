import { useContext, useEffect, useReducer } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { reducer, initialState, getSetRecipeToEditAction } from './WriteRecipeReducer'
import { handleStoreRecipe, shouldFetchRecipe } from './WriteRecipeLogic'
import { FieldErrorDisplay } from '../../custom/FieldErrorDisplay'
import { getRecipe, Ingredient, mapToRecipeFormResult, RecipeFormResult } from '../../../dataServices/RecipeService'
import { useNavigate, useParams } from 'react-router-dom'
import { getSafeUser, UserContext } from '../../../contexts/UserContext'
import { LoaderContext } from '../../../contexts/LoaderContext'
import { NumberInputProps, NumberInput } from '../../custom/NumberInput'
import { displayTags, parseTags } from '../../../tools/TagTools'
import { AISLES, buildOptions, UNITS } from '../../../constants/DropdownValues'
import { basicCatchToast } from '../../../tools/ToasterUtils'
import { voidHandleSubmit } from '../../../tools/ReactHookFormUtils'

const mainFormRules = {
  name: {
    required: { value: true, message: 'Le nom doit être renseigné' }
  },
  description: {
    maxLength: { value: 300, message: 'La description ne peut dépasser 300 caractères' }
  },
  servings: {
    valueAsNumber: true,
    min: { value: 1, message: 'Le nombre de parts doit être au minimum 1' },
    required: { value: true, message: 'Le nombre de parts doit être renseigné' }
  },
  tags: {
    maxLength: { value: 300, message: 'Les tags ne peut dépasser 300 caractère en tout' }
  }
}

const ingredientFormRules = {
  name: {
    required: { value: true, message: 'Le nom doit être renseigné' }
  },
  quantity: {
    valueAsNumber: true,
    min: { value: 1, message: 'La quantité doit être au minimum 1' },
    required: { value: true, message: 'La quantité doit être renseignée' }
  },
  unit: {
    required: { value: true, message: 'L\'unité doit être renseignée' }
  },
  aisle: {
    required: { value: true, message: 'Le rayon doit être renseigné' }
  }
}

const defaultRecipeValues: RecipeFormResult = {
  name: null as unknown as string,
  description: null as unknown as string,
  tags: null as unknown as string,
  servings: 0,
  ingredients: []
}
const defaultIngredient: Ingredient = {
  name: null as unknown as string,
  quantity: 0,
  unit: null as unknown as string,
  aisle: null as unknown as string
}

export const WriteRecipe = () => {
  const { user } = getSafeUser(useContext(UserContext))
  const [state, dispatch] = useReducer(reducer, initialState)
  const { recipeId } = useParams()
  const { setLoading } = useContext(LoaderContext)
  const navigate = useNavigate()

  const useFormReturn = useForm<RecipeFormResult>({
    defaultValues: { ...defaultRecipeValues }
  })
  const { control, handleSubmit, watch, register, formState: { errors }, reset, getValues, setValue } = useFormReturn
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  })

  useEffect(() => {
    if (shouldFetchRecipe(state, recipeId)) {
      setLoading(true)
      getRecipe(recipeId ?? '')
        .then(data => {
          const recipeData = mapToRecipeFormResult(data)
          dispatch(getSetRecipeToEditAction(recipeData))
          reset(recipeData)
          setLoading(false)
        })
        .catch(basicCatchToast)
    }
  }, [recipeId, reset, state, setLoading])

  const onSubmit = handleSubmit(data => {
    handleStoreRecipe(
      () => reset({ ...defaultRecipeValues }),
      setLoading,
      navigate
    )(user, data, recipeId)
  })

  console.log(watch())

  const servingsProps: NumberInputProps = {
    id: 'main.servings',
    label: 'Nombre de parts',
    hiddenInput: true,
    fieldName: 'servings',
    fieldRules: mainFormRules.servings,
    getValue: () => getValues().servings,
    setValue,
    register,
    error: errors.servings
  }

  const formattedTags = displayTags(parseTags(getValues().tags))

  return (
        <>
            <h4 className="mt-1">Créer une recette</h4>
            <form onSubmit={voidHandleSubmit(onSubmit)}>
                <div className="row">
                    <div className="six columns">
                        <label htmlFor="main.name">Nom</label>
                        <input id="main.name" className="u-full-width" type="text"
                            {...register('name', mainFormRules.name)} /><br />
                        <FieldErrorDisplay fieldError={errors.name} /><br />
                    </div>
                    <div className="six columns">
                        <NumberInput {...servingsProps} />
                    </div>
                </div>

                <label htmlFor="main.description">Description</label>
                <textarea id="main.description" className="u-full-width"
                    {...register('description', mainFormRules.description)} /><br />
                <FieldErrorDisplay fieldError={errors.description} />

                <label htmlFor="main.tags">Tags</label>
                <textarea id="main.tags" className="u-full-width"
                    {...register('tags', mainFormRules.tags)} /><br />
                <FieldErrorDisplay fieldError={errors.tags} />
                <p>{formattedTags}</p>

                {
                    fields.map((it, index) => {
                      const indexedPrefix = `ing.${index}`

                      const quantityProps: NumberInputProps = {
                        id: `${indexedPrefix}.quantity`,
                        label: 'Quantité',
                        hiddenInput: false,
                        fieldName: `ingredients.${index}.quantity`,
                        fieldRules: ingredientFormRules.quantity,
                        getValue: () => getValues().ingredients?.[index]?.quantity,
                        setValue,
                        register,
                        error: errors?.ingredients?.[index]?.quantity
                      }

                      return <>
                            <div className="separator" />
                            <fieldset key={it.id}>
                                <div className="input-row">
                                    <div>
                                        <label htmlFor={`${indexedPrefix}.name`}>Nom</label>
                                        <input id={`${indexedPrefix}.name`} className="ingredient-name" {...register(`ingredients.${index}.name`, ingredientFormRules.name)} type="text" /><br />
                                        <FieldErrorDisplay fieldError={errors?.ingredients?.[index]?.name} /><br />
                                    </div>
                                    <div>
                                        <label htmlFor={`${indexedPrefix}.unit`}>Unité</label>
                                        <select id={`${indexedPrefix}.unit`} {...register(`ingredients.${index}.unit`, ingredientFormRules.unit)}>
                                            {buildOptions(UNITS)}
                                        </select><br />
                                        <FieldErrorDisplay fieldError={errors?.ingredients?.[index]?.unit} /><br />
                                    </div>
                                </div>
                                <div className="row">
                                    <NumberInput {...quantityProps} />
                                </div>
                                <div className="input-row">
                                    <div>
                                        <label htmlFor={`${indexedPrefix}.aisle`}>Rayon</label>
                                        <select id={`${indexedPrefix}.aisle`} {...register(`ingredients.${index}.aisle`, ingredientFormRules.aisle)} className="w-90">
                                            {buildOptions(AISLES)}
                                        </select><br />
                                        <FieldErrorDisplay fieldError={errors?.ingredients?.[index]?.aisle} /><br />
                                    </div>
                                    <button className="delete-ing-button" type="button" onClick={() => remove(index)}>Retirer</button>
                                </div>
                            </fieldset>
                        </>
                    })
                }

                <div className="button-column">
                    <button type="button" onClick={() => { append({ ...defaultIngredient }) }}>
                        ajouter ingrédient
                    </button>
                    <input type="submit" className="button-primary" value="Enregistrer recette" />
                </div>
            </form>
        </>
  )
}
