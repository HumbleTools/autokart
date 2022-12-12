import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoaderContext } from '../../../contexts/LoaderContext'
import { deleteRecipe, getRecipe, Ingredient, DbRecipe } from '../../../dataServices/RecipeService'
import { buildIngredientLabel } from '../../../tools/LabelUtils'
import { displayTags } from '../../../tools/TagTools'
import { basicCatchToast } from '../../../tools/ToasterUtils'
import { PlanRecipe } from '../../plan/PlanRecipe'

export const ViewRecipe = () => {
  const { recipeId } = useParams()
  const [recipe, setRecipe] = useState<DbRecipe>()
  const navigate = useNavigate()
  const { setLoading } = useContext(LoaderContext)

  const handleDelete = () => {
    if (window.confirm('Supprimer cette recette ?') && recipeId) {
      setLoading(true)
      deleteRecipe(recipeId)
        .then(() => {
          setLoading(false)
          toast.success('Recette supprimée !')
          navigate('/')
        })
        .catch(basicCatchToast)
    }
  }
  const handleEdit = () => {
    navigate(`/writeRecipe/${recipeId ?? ''}`)
  }

  useEffect(() => {
    if ((recipe == null) && recipeId) {
      setLoading(true)
      getRecipe(recipeId)
        .then(data => {
          setRecipe(data)
          setLoading(false)
        })
        .catch(basicCatchToast)
    }
  }, [recipe, recipeId, setLoading])

  return <>
        {(recipe != null) &&
            <>
                <h4 className="mt-1">{recipe.name}</h4>
                <p className="text-right">Pour {recipe.servings} personne{recipe.servings >= 1 ? 's' : ''}</p>
                <h5>Description</h5>
                <p>{recipe.description}</p>
                <h5>Tags</h5>
                <p>{displayTags(recipe.tags)}</p>
                {recipe.ingredients && <>
                    <h5>Ingrédients</h5>
                    <ul>{recipe.ingredients.map(it => ingredientView(it))}</ul>
                </>}
                <div className="button-column">
                    <PlanRecipe recipeName={recipe.name} recipeId={recipeId ?? ''} /><br />
                    <button className="button-primary" onClick={handleEdit}>Éditer</button><br />
                    <button className="delete-button" onClick={handleDelete}>Supprimer</button><br />
                </div>
            </>}
    </>
}

const ingredientView = (ingredient: Ingredient) =>
    <li key={ingredient.name}>{buildIngredientLabel(ingredient)}</li>
