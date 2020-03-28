import { useQuery } from "react-query";
import { getPrivateCategories } from "../../serviceFacade/appServiceFacade";

/**
 *
 * @author sriram
 *
 */

function AppsNavigation() {
    const { status, data, error } = useQuery("getPrivateCategories", getPrivateCategories);

    return(
        <div>
            {status === 'loading' ? (
                <span>Loading...</span>
            ) : status === 'error' ? (
                <span>Error: {error.message}</span>
            ) : (
                // also status === 'success', but "else" logic works, too
               <span>cat: {data.categories.length}</span>
            )}
        </div>
    );
}

export default AppsNavigation;

