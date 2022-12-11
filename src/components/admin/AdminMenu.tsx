import { useContext } from "react";
import { Link } from "react-router-dom";
import { getSafeUser, UserContext } from "../../contexts/UserContext";
import { isAdmin } from "../../dataServices/UserService";

export const AdminMenu = () => {
    const userContext = getSafeUser(useContext(UserContext));
    return isAdmin(userContext.roles) ? <>
        <h4>Menu admin</h4>
        <div className="row button-column">
            <Link to="/admin/shoppingCategories">
                <button className="button-primary">Catégories shopping</button>
            </Link>
        </div>
    </>
    : <p>Vous n'êtes pas admin.</p>;
};