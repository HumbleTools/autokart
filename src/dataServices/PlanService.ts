import { getApp } from 'firebase/app'
import { collection, doc, getDocs, getFirestore, orderBy, query, runTransaction, where } from 'firebase/firestore'
import { RecipePlanForm } from '../components/plan/PlanRecipe'
import { getRecipe } from './RecipeService'
import { buildShoppingItem, SHOPPING } from './ShoppingService'

const PLANS = 'plans'

export const savePlan = async (
  planForm: RecipePlanForm,
  recipeId: string,
  recipeName: string
) => {
  const recipe = await getRecipe(recipeId)
  const planToStore: RecipePlan = {
    ...planForm,
    recipeId,
    recipeName,
    createdAt: new Date().getTime()
  }
  const db = getFirestore(getApp())
  return await runTransaction(db, async transaction => {
    const newPlanRef = doc(db, PLANS, generateId())
    transaction.set(newPlanRef, planToStore)
    recipe.ingredients
      .map(it => buildShoppingItem(recipeId, newPlanRef.id, it))
      .forEach(it => transaction.set(doc(db, SHOPPING, generateId()), it))
  })
}

export const getFuturePlans: () => Promise<DbRecipePlan[]> = async () => {
  const db = getFirestore(getApp())
  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)
  const querySnapshot = await getDocs(query(
    collection(db, PLANS),
    where('date', '>=', todayMidnight.getTime()),
    orderBy('date', 'asc')
  ))
  const results: DbRecipePlan[] = []
  querySnapshot.forEach((doc) => {
    results.push({
      ...doc.data(),
      id: doc.id
    } as unknown as DbRecipePlan)
  })
  return results
}

export const deletePlan = async (id: string) => {
  const db = getFirestore(getApp())
  const querySnapshot = await getDocs(query(
    collection(db, SHOPPING),
    where('planId', '==', id)
  ))
  return await runTransaction(db, async transaction => {
    querySnapshot.forEach(shoppingItem => {
      transaction.delete(doc(db, `${SHOPPING}/${shoppingItem.id}`))
    })
    transaction.delete(doc(db, `${PLANS}/${id}`))
  })
}

export interface RecipePlan {
  recipeId: string
  recipeName: string
  date: number
  repas: string
  createdAt: number
}

export interface DbRecipePlan extends RecipePlan {
  id: string
}

export const generateId = (): string => {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let autoId = ''
  for (let i = 0; i < 20; i++) {
    autoId += CHARS.charAt(
      Math.floor(Math.random() * CHARS.length)
    )
  }
  return autoId
}
