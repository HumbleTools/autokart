import { getApp } from "firebase/app";
import { User } from "firebase/auth";
import {
    getFirestore, getDocs, collection, orderBy, query,
    limit, doc, getDoc, addDoc, deleteDoc, updateDoc, where, DocumentData, Query, Firestore
} from "firebase/firestore";
import { parseTags } from '../tools/TagTools';

export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
    aisle: string;
};
export interface RecipeFormResult {
    name: string;
    description: string;
    servings: number;
    tags: string;
    ingredients: Ingredient[];
};
export interface DbRecipe {
    name: string;
    description: string;
    servings: number;
    ingredients: Ingredient[];
    tags: string[];
    keywords: string[];
    author: string;
    createdAt: number;
}
export interface DbRecipeWithId extends DbRecipe {
    id: string;
}

export interface CookbookRecipe extends Omit<DbRecipeWithId, 'id'|'keywords'> {}

export const RECIPES = 'recipes';

type QueryProvider = (db: Firestore) => Query<DocumentData>;

const queryRecipes: (query: QueryProvider) => Promise<DbRecipeWithId[]> =
    async (query) => {
        const db = getFirestore(getApp());
        const querySnapshot = await getDocs(query(db));
        const results: DbRecipeWithId[] = [];
        querySnapshot.forEach(doc => {
            results.push({
                id: doc.id,
                ...doc.data()
            } as unknown as DbRecipeWithId);
        });
        return results;
    };

export const getLastNRecipes: (limitValue: number) => Promise<DbRecipeWithId[]> =
    async limitValue => queryRecipes(db => query(
            collection(db, 'recipes'),
            orderBy('createdAt', 'desc'),
            limit(limitValue)
        ));

export const getRecipesByWords: (words: string[], searchField: 'keywords'|'tags') => Promise<DbRecipeWithId[]> =
    async (words, searchField) => {
        if(words && words.length) {
            const searchWords = buildSearchWords(words);
            return queryRecipes((db) => query(
                collection(db, RECIPES),
                where(searchField, 'array-contains-any', searchWords),
                orderBy('createdAt', 'desc')
            ));
        }
        return queryRecipes(db => query(
            collection(db, 'recipes'),
            orderBy('name'),
            limit(100)
        ));
    };

const buildSearchWords = (words: string[]) => {
    const result = new Set<string>();
    words.forEach(it => {
        result.add(it);
        if(it.endsWith('s')) {
            result.add(it.substring(0, it.length-1));
        } else {
            result.add(it+'s');
        }
    });
    return Array.from(result);
};

export const getRecipe = async (id?: string) => {
    const db = getFirestore(getApp());
    const recipeDoc = await getDoc(doc(db, `${RECIPES}/${id}`));
    return recipeDoc.data() as DbRecipe;
};

export const saveRecipe = async (user: User, recipe: RecipeFormResult, recipeId?: string) => {
    const db = getFirestore(getApp());
    const stampedRecipe = mapToDbRecipe(recipe, user);
    let ref;
    if (recipeId) {
        ref = doc(db, `${RECIPES}/${recipeId}`);
        await updateDoc(ref, { ...stampedRecipe });
    } else {
        await addDoc(collection(db, RECIPES), stampedRecipe).then(data => {
            ref = data;
        });
    }
    return ref?.id;
};

const mapToDbRecipe: (recipeForm: RecipeFormResult, user: User) => DbRecipe = (recipeForm, user) => {
    return {
        createdAt: Date.now(),
        author: user.displayName + '',
        name: recipeForm.name,
        description: recipeForm.description,
        servings: recipeForm.servings,
        tags: parseTags(recipeForm.tags),
        ingredients: recipeForm.ingredients,
        keywords: buildKeyWords(recipeForm),
    };
};

const buildKeyWords: (recipeForm: RecipeFormResult) => string[] = recipeForm => {
    const ingredientsKeywords = recipeForm.ingredients.map(it => parseTags(it.name)).flatMap(it => it);
    const allKeyWords = ([] as string[])
        .concat(parseTags(recipeForm.name))
        .concat(parseTags(recipeForm.description))
        .concat(ingredientsKeywords)
        .concat(parseTags(recipeForm.tags))
        .map(it => it.toLowerCase());
    return Array.from(new Set<string>(allKeyWords));
}

export const mapToRecipeFormResult: (dbRecipe: DbRecipe) => RecipeFormResult = dbRecipe => {
    return {
        name: dbRecipe.name,
        description: dbRecipe.description,
        servings: dbRecipe.servings,
        tags: dbRecipe.tags.join(' '),
        ingredients: dbRecipe.ingredients,
    };
};

export const deleteRecipe = async (id: string) => {
    const db = getFirestore(getApp());
    deleteDoc(doc(db, `${RECIPES}/${id}`));
};

export const getAllRecipes = async () => 
    queryRecipes(db => query(
        collection(db, 'recipes'),
        orderBy('name')
    ));

export const mapToCookbookRecipes = (recipes: DbRecipeWithId[]) => 
    recipes.map(it => {
        const {id, keywords, ...cookbookRecipe} = it;
        return cookbookRecipe;
    });
