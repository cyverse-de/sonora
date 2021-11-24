/**
 * @author aramsey
 */

import React from "react";
import { mockAxios } from "../axiosMock";
import { userInfoResp } from "../UserInfoMocks";
import SearchButton from "../../src/components/search/form/SearchButton";
import { dataSearchResp } from "./searchMocks";

function AdvancedSearchFormTest() {
    mockAxios.onGet(/\/api\/subjects.*/).reply(200, {
        subjects: [
            ...Object.values(userInfoResp),
            { id: "test_user", email: "test@test.com", name: "Testy Test" },
        ],
    });
    mockAxios
        .onGet(/\/api\/user-info.*username=alfred.*/)
        .reply(200, userInfoResp);

    mockAxios.onPost(/\/api\/filesystem\/search.*/).reply(200, dataSearchResp);

    return <SearchButton />;
}

export default { title: "Search / Advanced / Form" };

export const AdvancedSearchForm = () => <AdvancedSearchFormTest />;
