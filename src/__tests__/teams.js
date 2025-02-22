import React from "react";
import renderer from "react-test-renderer";

import { View, SearchResults } from "../../stories/teams/Teams.stories";
import { mockAxios } from "../../stories/axiosMock";
import { UserProfileProvider } from "contexts/userProfile";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { EmotionCacheProvider } from "__mocks__/EmotionCacheProvider";
import { getAllPrivileges, getPrivilegeUpdates } from "components/teams/util";
import Privilege from "components/models/Privilege";
import { RQWrapper } from "../__mocks__/RQWrapper";
import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme/default";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

const GrouperAllUsersId = "GrouperAll";
const GrouperAdminId = "de_grouper";

test("Team view renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <UserProfileProvider>
                <I18nProviderWrapper>
                    <EmotionCacheProvider>
                        <ThemeProvider theme={theme}>
                            <View />
                        </ThemeProvider>
                    </EmotionCacheProvider>
                </I18nProviderWrapper>
            </UserProfileProvider>
        </RQWrapper>
    );
    component.unmount();
});

test("Team search results renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <UserProfileProvider>
                <I18nProviderWrapper>
                    <ThemeProvider theme={theme}>
                        <SearchResults />
                    </ThemeProvider>
                </I18nProviderWrapper>
            </UserProfileProvider>
        </RQWrapper>
    );
    component.unmount();
});

function createPrivilegeList(privileges, userId) {
    const a = [];
    const b = [];
    privileges.forEach(([before, after], index) => {
        before &&
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
        GrouperAdminId
    );
    const result = Object.values(
        getAllPrivileges(before, [], GrouperAllUsersId, GrouperAdminId)
    );

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
    const result = Object.values(
        getAllPrivileges(before, [], GrouperAllUsersId, GrouperAdminId)
    );

    expect(result).toStrictEqual(after);
});

it("tests that public privileges don't go above `view`", () => {
    const [before, after] = createPrivilegeList(
        [[Privilege.READ, Privilege.VIEW]],
        GrouperAllUsersId
    );

    const result = Object.values(
        getAllPrivileges(before, [], GrouperAllUsersId, GrouperAdminId)
    );
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

    const result = Object.values(
        getAllPrivileges(before, [], GrouperAllUsersId, GrouperAdminId)
    );
    expect(result).toStrictEqual(after);
});

it("tests that missing member gets default member privilege", () => {
    const member = {
        id: "batman",
    };

    const after = [{ name: "read", subject: { ...member } }];

    const result = Object.values(
        getAllPrivileges([], [member], GrouperAllUsersId, GrouperAdminId)
    );
    expect(result).toStrictEqual(after);
});

it("tests that getPrivilegeUpdates detects a deleted privilege", () => {
    const [before, after] = createPrivilegeList(
        [[Privilege.READ, null]],
        "batman"
    );

    const { remove, add, update } = getPrivilegeUpdates(
        before,
        after,
        GrouperAllUsersId,
        GrouperAdminId
    );
    expect(remove).toStrictEqual(["batman"]);
    expect(add).toStrictEqual([]);
    expect(update).toStrictEqual([]);
});

it("tests that getPrivilegeUpdates detects an added privilege", () => {
    const [before, after] = createPrivilegeList(
        [[null, Privilege.READ]],
        "batman"
    );

    const { remove, add, update } = getPrivilegeUpdates(
        before,
        after,
        GrouperAllUsersId,
        GrouperAdminId
    );
    expect(remove).toStrictEqual([]);
    expect(add).toStrictEqual(after);
    expect(update).toStrictEqual([]);
});

it("tests that getPrivilegeUpdates detects an updated privilege", () => {
    const [before, after] = createPrivilegeList(
        [[Privilege.ADMIN, Privilege.READ]],
        "batman"
    );

    const { remove, add, update } = getPrivilegeUpdates(
        before,
        after,
        GrouperAllUsersId,
        GrouperAdminId
    );
    expect(remove).toStrictEqual([]);
    expect(add).toStrictEqual([]);
    expect(update).toStrictEqual(after);
});
