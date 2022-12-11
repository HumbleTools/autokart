import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { LoaderContext } from "../../contexts/LoaderContext";
import { getSafeUser, UserContext } from "../../contexts/UserContext";
import { CookbookRecipe, getAllRecipes, mapToCookbookRecipes } from "../../dataServices/RecipeService";
import { isAdmin } from "../../dataServices/UserService";
import { usePopin } from "../../hooks/usePopin";
import { Popin } from "../custom/Popin";

export const AdminMenu = () => {
    const userContext = getSafeUser(useContext(UserContext));
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
    
    return isAdmin(userContext.roles) ? <>
        <h4 className="mt-1">Menu admin</h4>
        <div className="row button-column">
            <button className="button-primary" onClick={handleExportClick}>Exporter les recettes</button>
        </div>
        <Popin {...popinProps}>
            <h4>Exporter les recettes</h4>
            Les données sont disponibles au format JSON.<br />
            <a type="button"
                href={`data:text/json;charset=utf-16,${encodeURIComponent(JSON.stringify(cookBookData))}`}
                download="cookbook.json">
                Télécharger
            </a>
        </Popin>
    </>
    : <p>Vous n'êtes pas admin.</p>;
};