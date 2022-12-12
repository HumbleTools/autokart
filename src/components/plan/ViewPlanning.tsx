import { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoaderContext } from '../../contexts/LoaderContext'
import { DbRecipePlan, deletePlan, getFuturePlans } from '../../dataServices/PlanService'
import { addDays, getDateString, getDayName } from '../../tools/DateUtils'
import { basicCatchToast } from '../../tools/ToasterUtils'

export const ViewPlanning = () => {
  const [plans, setPlans] = useState<DbRecipePlan[]>(null as unknown as DbRecipePlan[])
  const { setLoading } = useContext(LoaderContext)

  const handleDelete: HandleDelete = (plan: DbRecipePlan, index: number) => () => {
    if (window.confirm('Supprimer cette recette ?') && plan.recipeId) {
      setLoading(true)
      deletePlan(plan.id)
        .then(() => {
          setLoading(false)
          toast.success('Recette retirée du planning !')
          const prunedPlanning = [...plans]
          prunedPlanning.splice(index, 1)
          setPlans(prunedPlanning)
        })
        .catch(basicCatchToast)
    }
  }

  useEffect(() => {
    if (!plans) {
      setLoading(true)
      getFuturePlans()
        .then(data => setPlans(sortPlanning(data)))
        .finally(() => {
          setLoading(false)
        })
    }
  }, [plans, setPlans, setLoading])

  return <>
        <h4 className="mt-1">Planning</h4>
        {(!plans || (plans.length === 0)) && <p>Il n'y a rien de planifié pour le moment.</p>}
        {mapPlans(handleDelete, plans)}
    </>
}

const sortPlanning = (plans?: DbRecipePlan[]) => {
  const resultMap = new Map<string, DbRecipePlan[][]>()
  if (plans == null) {
    return []
  }
  plans.forEach(plan => {
    const date = getDateString(plan.date)
    const planArrays = (resultMap.has(date) ? resultMap.get(date) : [[], [], []]) as DbRecipePlan[][]
    switch (plan.repas) {
      case 'midi':
        planArrays[0].push(plan)
        break
      case 'soir':
        planArrays[1].push(plan)
        break
      case 'autre':
        planArrays[2].push(plan)
        break
    }
    resultMap.set(date, planArrays)
  })
  let sortedPlanning: DbRecipePlan[] = []
  resultMap.forEach(plans => {
    sortedPlanning = sortedPlanning.concat(plans.flatMap(it => it))
  })
  return sortedPlanning
}

type HandleDelete = (plan: DbRecipePlan, index: number) => () => void

const mapPlans = (handleDelete: HandleDelete, plans: DbRecipePlan[]) => {
  let curDate = getDateString(addDays(new Date(), -1))
  return plans?.map((plan, index) => {
    const nextDate = getDateString(plan.date)
    const dateChanged = curDate !== nextDate

    const planOutput = <p className="planline">
            <NavLink to={`/view/${plan.recipeId}`}>{plan.recipeName}</NavLink> ({plan.repas})
            <button className="delete-button float-right" onClick={handleDelete(plan, index)}>Retirer</button>
        </p>
    if (dateChanged) {
      curDate = nextDate
    }
    return <div key={`plan-${index}`}>
            {dateChanged && <h5 className="capitalize">{`${getDayName(plan.date)} ${nextDate}`}</h5>}
            {planOutput}
        </div>
  })
}
