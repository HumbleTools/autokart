import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LoaderContext } from "../../contexts/LoaderContext";
import { savePlan } from "../../dataServices/PlanService";
import { usePopin } from "../../hooks/usePopin";
import { getDateStringForInput, parseDate } from "../../tools/DateUtils";
import { FieldErrorDisplay } from "../custom/FieldErrorDisplay";
import { Popin } from "../custom/Popin";

interface PlanRecipeProps {
    recipeName: string;
    recipeId: string;
}

export interface RecipePlanForm {
    date: number;
    repas: string;
}

const defaultPlan: RecipePlanForm = {
    date: new Date().getTime(),
    repas: 'soir',
};

export const PlanRecipe = (props: PlanRecipeProps) => {
    const popinProps = usePopin();
    const [dateValue, setDateValue] = useState(getDateStringForInput(new Date()));
    const { setLoading } = useContext(LoaderContext);

    const { handleSubmit, register, formState: { errors }, watch, setValue, reset } = useForm<RecipePlanForm>({
        defaultValues: { ...defaultPlan }
    });

    const onSubmit: SubmitHandler<RecipePlanForm> = data => {
        setLoading(true);
        savePlan(data, props.recipeId, props.recipeName)
            .then(() => {
                toast.success('Recette planifiée !');
                popinProps.toggleDisplay();
                reset(defaultPlan);
                setDateValue(getDateStringForInput(new Date()));
            })
            .catch((error => {
                console.error(error);
                toast.error('Something went wrong...');
            }))
            .finally(() => {
                setLoading(false);
            });
    };
    const onDateChange = (date: string) => {
        if (date) {
            const parsed = parseDate(date);
            setValue('date', parsed.getTime());
            setDateValue(date);
        }
    };

    console.log(watch());

    return <>
        <button onClick={popinProps.toggleDisplay}>Planifier</button>
        <Popin {...popinProps}>
            <h4>Planifier</h4>
            <p>{props.recipeName}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="date"
                    value={dateValue}
                    min={getDateStringForInput(new Date())}
                    onChange={e => onDateChange(e.target.value)}
                />
                <input type="hidden" {...register("date", { required: true })} />
                <br /><FieldErrorDisplay fieldError={errors.date} />
                <div className="text-left padding-l-45">
                    <input id='midi' {...register("repas", { required: true })} type="radio" value="midi" />
                    <label htmlFor='midi'>midi</label>
                    <br /><input id='soir'{...register("repas", { required: true })} type="radio" value="soir" />
                    <label htmlFor='soir'>soir</label>
                    <br /><input id='autre'{...register("repas", { required: true })} type="radio" value="autre" />
                    <label htmlFor='autre'>autre</label>
                    <br /><FieldErrorDisplay fieldError={errors.repas} />
                </div>
                <div className="button-column">
                    <input type="submit" className="button-primary" value="OK" />
                    <button onClick={popinProps.toggleDisplay}>Annuler</button>
                </div>
            </form>
        </Popin>
    </>;
}