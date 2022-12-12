import { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { LoaderContext } from '../../contexts/LoaderContext'
import { Ingredient } from '../../dataServices/RecipeService'
import { DbShoppingItemWithId, deleteStrikedItems, getShoppingList, restoreItems, saveStrikeState, watchShoppingList } from '../../dataServices/ShoppingService'
import { buildIngredientLabel } from '../../tools/LabelUtils'
import { buildGroupedItems, getCrossedOffClass, GroupedItem, filterOutStrikedItems, hasCrossedItems } from './ShoppingListLogic'

export const ShoppingList = () => {
  const [categorizedItems, setCategorizedItems] = useState<GroupedItem[][]>(null as unknown as GroupedItem[][])
  const { setLoading } = useContext(LoaderContext)
  const listRefresher = (values: DbShoppingItemWithId[]) => setCategorizedItems(buildGroupedItems(values))

  useEffect(() => {
    if (!categorizedItems) {
      setLoading(true)
      getShoppingList()
        .then(data => {
          listRefresher(data)
          watchShoppingList(listRefresher)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [categorizedItems, setCategorizedItems, setLoading])

  const resultsAreIn = () => {
    return categorizedItems && !(categorizedItems.length === 0)
  }

  const handleItemClick = (item: GroupedItem) => () => {
    const localStrike = () => {
      item.crossedOff = !item.crossedOff
      setCategorizedItems([...categorizedItems])
    }
    localStrike()
    saveStrikeState(item)
      .catch(error => {
        localStrike()
        console.log(error)
        toast.error('Erreur lors du cochage...')
      })
  }

  const removeStrikedClick = () => {
    if (window.confirm('Supprimer les éléments barrés ?')) {
      setLoading(true)
      deleteStrikedItems()
        .then(() => {
          setCategorizedItems(filterOutStrikedItems(categorizedItems))
          toast.success('Éléments supprimés !')
        })
        .catch((error) => {
          console.log(error)
          toast.error('Erreur lors de la suppression des éléments barrés...')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const restoreClick = () => {
    if (window.confirm('Restaurer la liste à partir du planning ?')) {
      setLoading(true)
      restoreItems()
        .then(() => {
          setCategorizedItems(null as unknown as GroupedItem[][])
          toast.success('Liste de course restaurée !')
        })
        .catch((error) => {
          console.log(error)
          toast.error('Erreur lors de la restauration de la liste...')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return <>
        <h4 className="mt-1">Liste de courses</h4>
        {!resultsAreIn() && <p>La liste de courses est vide.</p>}
        <div className="row button-column">
            {resultsAreIn() && <button
                onClick={removeStrikedClick}
                className="delete-button"
                disabled={!hasCrossedItems(categorizedItems)}>
                Retirer lignes barrées
            </button>}
            <button onClick={restoreClick}>
                Restaurer la liste
            </button>
        </div>
        {resultsAreIn() && categorizedItems.map((cat, catIndex) =>
            <table className="u-full-width" key={catIndex}>
                <thead>
                    <tr>
                        <th>{cat[0].aisle}</th>
                    </tr>
                </thead>
                <tbody>
                    {cat.map((item, itemIndex) =>
                        <tr key={itemIndex}>
                            <td onClick={handleItemClick(item)}
                                className={getCrossedOffClass(item.crossedOff)}>
                                {buildIngredientLabel(item as Ingredient)}
                            </td>
                        </tr>)}
                </tbody>
            </table>)}
    </>
}
