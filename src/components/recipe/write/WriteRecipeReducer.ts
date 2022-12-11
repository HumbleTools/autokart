import { RecipeFormResult } from "../../../dataServices/RecipeService";

export interface Message {
  level: string;
  text: string;
};

export const initialState = {
  recipeToEdit: null as unknown as RecipeFormResult,
};
export type WriteRecipeState = typeof initialState;

export type Dispatch = (value: Action<any>) => void;

export interface Action<T> {
  type: string;
  data: T;
}

export const ON_EDITABLE_RECIPE_FETCHED = 'ON_EDITABLE_RECIPE_FETCHED';
export const getSetRecipeToEditAction: (recipe: RecipeFormResult) => Action<RecipeFormResult> = recipe => ({
  type: ON_EDITABLE_RECIPE_FETCHED,
  data: recipe
});
export const onEditableRecipeFetched = (state: WriteRecipeState, action: Action<RecipeFormResult>) => {
  return {
    ...state,
    recipeToEdit: action.data
  };
};

export const reducer = (state: WriteRecipeState, action: Action<any>) => {
  switch (action.type) {
    case ON_EDITABLE_RECIPE_FETCHED:
      return onEditableRecipeFetched(state, action);
    default:
      throw new Error(`Action type ${action.type} unknown !`);
  }
};