import { useContext } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { LoaderContext } from "../../contexts/LoaderContext";
import { displayTags, parseTags } from "../../tools/TagTools";
import { FieldErrorDisplay } from "../custom/FieldErrorDisplay";

export interface Category {
    name: string;
    tags: string;
}
export interface CategoriesFormResult {
    categories: Category[];
}
const rules = {
    name: {
        required: { value: true, message: 'Le nom doit être renseigné' },
        maxLength: { value: 30, message: 'Le nom ne peut dépasser 30 caractères' }
    },
    tags: {
        required: { value: true, message: 'Les tags ne peuvvent être vides' },
        maxLength: { value: 1000, message: 'Les tags ne peuvent dépasser 1000 caractère en tout' }
    }
};

export const ShoppingCategories = () => {
    const { setLoading } = useContext(LoaderContext);
    const { control, handleSubmit, watch, register, formState: { errors }, reset, getValues } = useForm<CategoriesFormResult>({
        defaultValues: {
            categories: [],
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'categories'
    });

    const onSubmit: SubmitHandler<CategoriesFormResult> = data => {
        console.log(data);
    };

    console.log(watch());

    return <>
        <h4>Shopping categories</h4>
        <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((it, index) => {
                const indexedPrefix = `cat.${index}`;
                return <div key={it.id}>
                    <div className="separator" />
                    <fieldset>
                        <div className="row">
                            <label htmlFor={`${indexedPrefix}.name`}>Nom</label>
                            <input id={`${indexedPrefix}.name`} type="text"
                                className="u-full-width"
                                {...register(`categories.${index}.name`, rules.name)}
                            />
                            <FieldErrorDisplay fieldError={errors.categories?.[index]?.name} /><br />
                        </div>
                        <div className="row">
                            <label htmlFor={`${indexedPrefix}.tags`}>Tags</label>
                            <textarea id={`${indexedPrefix}.tags`} className="u-full-width"
                                {...register(`categories.${index}.tags`, rules.tags)} />
                            <FieldErrorDisplay fieldError={errors.categories?.[index]?.tags} /><br />
                            <p>{displayTags(parseTags(getValues().categories[index]?.tags))}</p>
                        </div>
                        <div className="row text-center">
                            <button className="delete-button" type="button" onClick={() => remove(index)}>Retirer</button>
                        </div>
                    </fieldset>
                </div>;
            })}
            <div className="button-column">
                <button type="button" onClick={() => { append({ name: '', tags: '' }); }}>
                    Ajouter catégorie
                </button>
                <input type="submit" className="button-primary" value="Enregistrer" />
            </div>
        </form>
    </>;
};