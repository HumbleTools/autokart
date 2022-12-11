import { useContext } from "react";
import { getSafeUser, UserContext } from "../../contexts/UserContext";
import { isAdmin } from "../../dataServices/UserService";
import { ExportCookbook } from "./ExportCookbook";

export const AdminMenu = () => {
    const userContext = getSafeUser(useContext(UserContext));

    return isAdmin(userContext.roles) ? <>
        <h4 className="mt-1">Menu admin</h4>
        <div className="row button-column">
            <ExportCookbook />
        </div>
    </>
    : <p>Vous n'êtes pas admin.</p>;
};