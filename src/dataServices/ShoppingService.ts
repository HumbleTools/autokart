import { getApp } from "firebase/app";
import { getFirestore, getDocs, query, collection, orderBy, doc, getDoc, where, runTransaction, Firestore, DocumentData, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { GroupedItem } from "../components/shopping/ShoppingListLogic";
import { generateId, getFuturePlans } from "./PlanService";
import { DbRecipeWithId, Ingredient, RECIPES } from "./RecipeService";

export const SHOPPING = 'shoppingItems';

export interface DbShoppingItem {
    recipeId: string;
    planId: string;
    ingredient: Ingredient;
    crossedOff: boolean;
}

export interface DbShoppingItemWithId extends DbShoppingItem {
    id: string;
}

const getShoppingListQuery = (db: Firestore) => query(
    collection(db, SHOPPING),
    orderBy('ingredient.aisle'),
    orderBy('crossedOff'),
    orderBy('ingredient.name')
);

const mapShoppingList = (querySnapshot: QuerySnapshot<DocumentData>) => {
    const results: DbShoppingItemWithId[] = [];
    querySnapshot.forEach(doc => {
        results.push({
            id: doc.id,
            ...doc.data()
        } as unknown as DbShoppingItemWithId);
    });
    return results;
};

export const getShoppingList: () => Promise<DbShoppingItemWithId[]> =
    async () => {
        const db = getFirestore(getApp());
        const querySnapshot = await getDocs(getShoppingListQuery(db));
        return mapShoppingList(querySnapshot);
    };

type ShoppingListRefresher = (data: DbShoppingItemWithId[]) => void;

export const watchShoppingList = (updateData: ShoppingListRefresher) => {
    const db = getFirestore(getApp());
    const unsubscribe = onSnapshot(getShoppingListQuery(db), (querySnapshot) => {
        const shoppingItems = mapShoppingList(querySnapshot);
        updateData(shoppingItems);
        console.log(querySnapshot.metadata.hasPendingWrites? 'local':'server');
    });
    return unsubscribe;
};

export const saveStrikeState = async (groupedItem: GroupedItem) => {
    const itemRefs = groupedItem.itemList.map(it => doc(getFirestore(getApp()), `${SHOPPING}/${it.id}`));
    const db = getFirestore(getApp());
    return runTransaction(db, async transaction => {
        itemRefs.forEach((ref, index) => {
            transaction.update(ref, {
                ...groupedItem.itemList[index],
                crossedOff: groupedItem.crossedOff,
            });
        });
    });
};

export const deleteStrikedItems = async () => {
    const db = getFirestore(getApp());
    const querySnapshot = await getDocs(query(
        collection(db, SHOPPING),
        where('crossedOff', '==', true)
    ));
    return runTransaction(db, async transaction => {
        querySnapshot.forEach(strikedItem => {
            transaction.delete(doc(db, `${SHOPPING}/${strikedItem.id}`));
        })
    });
};

export const restoreItems = async () => {
    const db = getFirestore(getApp());
    const plans = await getFuturePlans();
    const newItemArrays = await Promise.all(
        plans.map(async plan => {
            const rawRecipe = await getDoc(doc(db, `${RECIPES}/${plan.recipeId}`));
            const recipe = {
                ...rawRecipe.data(),
                id: rawRecipe.id
            } as DbRecipeWithId;
            return recipe
                .ingredients
                .map(it => buildShoppingItem(plan.recipeId, plan.id, it)) as DbShoppingItem[];
        })
    );
    const currentItems = await getShoppingList();
    return runTransaction(db, async transaction => {
        currentItems.forEach(it => {
            transaction.delete(doc(db, `${SHOPPING}/${it.id}`));
        });
        newItemArrays
            .flatMap(it => it)
            .forEach(it => {
                transaction.set(doc(db, SHOPPING, generateId()), it);
            });
    });
};

export const buildShoppingItem = (recipeId: string, planId: string, ingredient: Ingredient) => ({
    recipeId,
    planId,
    ingredient: {
        ...ingredient,
    },
    crossedOff: false
});
