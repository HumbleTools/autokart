import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { LoaderContext } from "../../contexts/LoaderContext";
import { CookbookRecipe, getAllRecipes, mapToCookbookRecipes } from "../../dataServices/RecipeService";
import { usePopin } from "../../hooks/usePopin";
import { Popin } from "../custom/Popin";

export const ExportCookbook = () => {
    const { setLoading } = useContext(LoaderContext);
    const popinProps = usePopin();
    const [cookBookData, setCookBookData] = useState([] as CookbookRecipe[]);

    const handleExportClick = () => {
        setLoading(true);
        getAllRecipes()
        .then(data => {
            setCookBookData(mapToCookbookRecipes(data));
            popinProps.toggleDisplay();
        })
        .catch((error => {
            console.error(error);
            toast.error('Something went wrong...');
        }))
        .finally(() => {
            setLoading(false);
        });
    };

    return <>
        <button className="button-primary" onClick={handleExportClick}>Exporter les recettes</button>
        <Popin {...popinProps}>
            <h4>Exporter les recettes</h4>
            Les données sont disponibles au format JSON.<br />
            <a type="button"
                href={`data:text/json;charset=utf-16,${encodeURIComponent(JSON.stringify(cookBookData))}`}
                download="cookbook.json">
                Télécharger
            </a>
        </Popin>
    </>;
};