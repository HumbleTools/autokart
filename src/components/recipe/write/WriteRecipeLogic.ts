import { User } from "firebase/auth";
import { UseFormReset } from "react-hook-form";
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import { RecipeFormResult, saveRecipe } from "../../../dataServices/RecipeService";
import { WriteRecipeState } from "./WriteRecipeReducer";

export const handleStoreRecipe = (
    resetForm: UseFormReset<any>,
    setLoading: (value: React.SetStateAction<boolean>) => void,
    navigate: NavigateFunction
) => (
    user: User,
    recipe: RecipeFormResult,
    recipeId?: string
) => {
        let recipeIdSink = recipeId;
        setLoading(true);
        saveRecipe(user, recipe, recipeId)
            .then(newRecipeId => {
                resetForm();
                toast.success('Recette enregistrée !');
                recipeIdSink = newRecipeId;
            })
            .catch(e => {
                const errorLabel = `Erreur lors de l'enregistrement !`;
                console.log(errorLabel, e);
                toast.error(errorLabel);
            })
            .finally(() => {
                setLoading(false);
                navigate(`/view/${recipeIdSink}`);
            });
    };

export const shouldFetchRecipe = (state: WriteRecipeState, recipeId?: string) =>
    (!state.recipeToEdit && recipeId);
