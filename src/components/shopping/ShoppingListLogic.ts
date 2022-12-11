import { AISLES, getLabelFromId } from "../../constants/DropdownValues";
import { Ingredient } from "../../dataServices/RecipeService";
import { DbShoppingItemWithId } from "../../dataServices/ShoppingService";
import { buildIngredientLabel } from "../../tools/LabelUtils";

export interface GroupedItem {
    name: string;
    quantity: number;
    unit: string;
    aisle: string;
    crossedOff: boolean;
    itemList: DbShoppingItemWithId[];
}

export const getCrossedOffClass = (isCrossedOff: boolean) => isCrossedOff ? 'crossed' : '';

export const hasCrossedItems = (categories: GroupedItem[][]) =>
!!categories?.flatMap(cat => cat).filter(item => item.crossedOff).length;

export const buildGroupedItems: (items: DbShoppingItemWithId[]) => GroupedItem[][] = items => {
    const aisleGroups: DbShoppingItemWithId[][] = groupByAisle(items);
    const output: GroupedItem[][] = [];
    aisleGroups.forEach((aisle, aisleIndex) => {
        output.push([]);
        aisle.forEach(item => {
            let match = findMatchingGroupedItem(item, output[aisleIndex]);
            if (!match) {
                match = {
                    name: item.ingredient.name,
                    quantity: item.ingredient.quantity,
                    unit: item.ingredient.unit,
                    aisle: getLabelFromId(AISLES, item.ingredient.aisle),
                    crossedOff: item.crossedOff,
                    itemList: [item],
                };
                output[aisleIndex].push(match);
            } else {
                match.quantity += item.ingredient.quantity;
                match.itemList.push(item);
                match.crossedOff = match.crossedOff || item.crossedOff;
            }
        });
    });
    return output;
};

const groupByAisle: (items: DbShoppingItemWithId[]) => DbShoppingItemWithId[][] = items => {
    const categorized: DbShoppingItemWithId[][] = [];
    items.forEach(it => {
        const category = categorized.filter(cat => cat[0] && cat[0].ingredient.aisle === it.ingredient.aisle)[0];
        if (category) {
            category.push(it);
        } else {
            categorized.push([it]);
        }
    });
    return categorized;
};

const findMatchingGroupedItem = (item: DbShoppingItemWithId, groups: GroupedItem[]) => {
    let match: GroupedItem | undefined = groups.filter(group => equivalentNames(group.name, item.ingredient.name))[0];
    if (match && (match.unit !== item.ingredient.unit)) {
        console.log(`${buildIngredientLabel(match as Ingredient)} and ${buildIngredientLabel(item.ingredient)} units do not match !`);
        match = undefined;
    }
    return match;
};

const equivalentNames = (nameA: string, nameB: string) => {
    return nameA.trim().toLowerCase() === nameB.trim().toLowerCase();
};

export const filterOutStrikedItems = (categories: GroupedItem[][]) => {
    const filteredCategories: GroupedItem[][] = [];
    categories?.forEach(cat => {
        const filteredItems = cat.filter(item => !item.crossedOff);
        if (filteredItems.length) {
            filteredCategories.push(filteredItems);
        }
    });
    return filteredCategories;
};
