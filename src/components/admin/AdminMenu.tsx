import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { LoaderContext } from "../../contexts/LoaderContext";
import { getSafeUser, UserContext } from "../../contexts/UserContext";
import { CookbookRecipe, getAllRecipes, mapToCookbookRecipes } from "../../dataServices/RecipeService";
import { isAdmin } from "../../dataServices/UserService";
import { Popin } from "../custom/Popin";

export const AdminMenu = () => {
    const userContext = getSafeUser(useContext(UserContext));

    const { setLoading } = useContext(LoaderContext);
    const [displayPopin, setDisplayPopin] = useState(false);
    const toggleDisplay = () => setDisplayPopin(!displayPopin);
    const [cookBookData, setCookBookData] = useState([] as CookbookRecipe[]);

    const handleExportClick = () => {
        setLoading(true);
        // export that in dedicated comp
        getAllRecipes()
        .then(data => {
            setCookBookData(mapToCookbookRecipes(data));
            toggleDisplay();
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
            <Link to="/admin/shoppingCategories">
                <button className="button-primary">Catégories shopping</button>
            </Link>
            <button className="button-primary" onClick={handleExportClick}>Exporter les recettes</button>
        </div>
        <Popin display={displayPopin} toggleDisplay={toggleDisplay}>
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