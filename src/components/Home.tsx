import { useContext, useEffect, useState } from "react";
import { Noop } from "react-hook-form";
import { Link } from "react-router-dom";
import { LoaderContext } from "../contexts/LoaderContext";
import { getSafeUser, UserContext } from "../contexts/UserContext";
import { getLastNRecipes, DbRecipeWithId } from "../dataServices/RecipeService";

export const Home = () => {

    const [recipes, setRecipes] = useState<DbRecipeWithId[]>([]);
    const [recipesFetched, setRecipesFetched] = useState<boolean>(false);
    const { setLoading, loading } = useContext(LoaderContext);
    const userContext = getSafeUser(useContext(UserContext));

    const recipesList = recipes.map(it => <li key={it.createdAt}><Link to={`/view/${it.id}`}>{it.name}</Link> - par {it.author}</li>);
    const message = recipes.length ?
        'Voici les dernières recettes :'
        : 'Pas encore de recette. Ajoutes-en une !';

    useEffect(() => {
        if (!recipesFetched && !loading) {
            setLoading(true);
            getLastNRecipes(10).then(data => {
                setRecipes(data);
                setRecipesFetched(true);
                setLoading(false);
            });
        }
    }, [recipesFetched, loading, setLoading]);

    return <>
        <h4 className="mt-1">Bienvenue {userContext.user.displayName} !</h4>
        <MenuButtons />
        {recipesFetched && !loading && <>
            <p>{message}</p>
            <ul>{recipesList}</ul>
        </>}
    </>;
};

interface MenuButtonsProps {
    onButtonClicked?: Noop;
}

export const MenuButtons = (props: MenuButtonsProps) => <div className="row button-column">
    <Link to="/writeRecipe">
        <button className="button-primary" onClick={props.onButtonClicked}>Créer une recette</button>
    </Link>
    <Link to="/search">
        <button className="button-primary" onClick={props.onButtonClicked}>Chercher une recette</button>
    </Link>
    <Link to="/planning">
        <button className="button-primary" onClick={props.onButtonClicked}>Voir le planning</button>
    </Link>
    <Link to="/shopping">
        <button className="button-primary" onClick={props.onButtonClicked}>Liste de courses</button>
    </Link>
    {/* {isAdmin(userContext.roles) && <Link to="/admin">
    <button className="delete-button">Admin</button>
</Link>} */}
</div>;