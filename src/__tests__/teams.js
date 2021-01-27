import React from "react";
import renderer from "react-test-renderer";

import { View, SearchResults } from "../../stories/teams/Teams.stories";
import { mockAxios } from "../../stories/axiosMock";
import { UserProfileProvider } from "contexts/userProfile";
import { I18nProviderWrapper } from "../i18n";
import { getAllPrivileges } from "../components/teams/util";
import Privilege from "../components/models/Privilege";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Team view renders", () => {
    const component = renderer.create(
        <UserProfileProvider>
            <I18nProviderWrapper>
                <View />
            </I18nProviderWrapper>
        </UserProfileProvider>
    );
    component.unmount();
});

test("Team search results renders", () => {
    const component = renderer.create(
        <UserProfileProvider>
            <I18nProviderWrapper>
                <SearchResults />
            </I18nProviderWrapper>
        </UserProfileProvider>
    );
    component.unmount();
});

function createPrivilegeList(privileges, userId) {
    const a = [];
    const b = [];
    privileges.forEach(([before, after], index) => {
        a.push({
            name: before.value,
            subject: {
                id: userId || `${index}${before.value}`,
            },
        });
        after &&
            b.push({
                name: after.value,
                subject: {
                    id: userId || `${index}${before.value}`,
                },
            });
    });
    return [a, b];
}

it("tests that the grouper admin account is removed", () => {
    const [before, after] = createPrivilegeList(
        [[Privilege.ADMIN, null]],
        "de_grouper"
    );
    const result = Object.values(getAllPrivileges(before));

    expect(result).toStrictEqual(after);
});

it("tests that members only have `read` or `admin` privileges", () => {
    const [before, after] = createPrivilegeList([
        [Privilege.OPTOUT, Privilege.READ],
        [Privilege.OPTIN, Privilege.READ],
        [Privilege.VIEW, Privilege.READ],
        [Privilege.READ, Privilege.READ],
        [Privilege.ADMIN, Privilege.ADMIN],
    ]);
    const result = Object.values(getAllPrivileges(before));

    expect(result).toStrictEqual(after);
});

it("tests that public privileges don't go above `view`", () => {
    const [before, after] = createPrivilegeList(
        [[Privilege.READ, Privilege.VIEW]],
        "GrouperAll"
    );

    const result = Object.values(getAllPrivileges(before));
    expect(result).toStrictEqual(after);
});

it("tests that highest privilege wins", () => {
    const [before, after] = createPrivilegeList(
        [
            [Privilege.OPTOUT, Privilege.ADMIN],
            [Privilege.ADMIN, null],
        ],
        "batman"
    );

    const result = Object.values(getAllPrivileges(before));
    expect(result).toStrictEqual(after);
});

it("tests that missing member gets default member privilege", () => {
    const member = {
        id: "batman",
    };

    const after = [{ name: "read", subject: { ...member } }];

    const result = Object.values(getAllPrivileges([], [member]));
    expect(result).toStrictEqual(after);
});
