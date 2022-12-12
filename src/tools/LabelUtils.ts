import { Ingredient } from '../dataServices/RecipeService'

export const buildIngredientLabel = (ingredient: Ingredient) => {
  let unitOutput = ''
  switch (ingredient.unit) {
    case 'cac':
    case 'cas':
      unitOutput = ` ${ingredient.unit}`
      break
    case 'number':
      unitOutput = ''
      break
    default:
      unitOutput = ingredient.unit
  }
  return `${ingredient.quantity}${unitOutput} ${ingredient.name}`
}
