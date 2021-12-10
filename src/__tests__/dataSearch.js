import React from "react";

import { mockAxios } from "../../stories/axiosMock";
import TestRenderer from "react-test-renderer";
import { ConfigProvider } from "contexts/config";
import { I18nProviderWrapper } from "../i18n";
import { RQWrapper } from "../__mocks__/RQWrapper";
import { clearEmptyValues } from "components/search/form";
import { AdvancedSearchForm } from "../../stories/search/AdvancedSearchForm.stories";
import {
    MODIFIED_ARGS_DEFAULT,
    MODIFIED_TYPE,
} from "../components/search/form/clauses/Date";
import {
    LABEL_ARGS_DEFAULT,
    LABEL_TYPE,
} from "../components/search/form/clauses/FileName";
import {
    SIZE_ARGS_DEFAULT,
    SIZE_TYPE,
} from "../components/search/form/clauses/FileSize";
import {
    METADATA_ARGS_DEFAULT,
    METADATA_TYPE,
} from "../components/search/form/clauses/Metadata";
import {
    OWNER_ARGS_DEFAULT,
    OWNER_TYPE,
} from "../components/search/form/clauses/Owner";
import {
    PATH_ARGS_DEFAULT,
    PATH_TYPE,
} from "../components/search/form/clauses/Path";
import {
    PERMISSIONS_ARGS_DEFAULT,
    PERMISSIONS_TYPE,
} from "../components/search/form/clauses/Permissions";
import {
    TAGS_ARGS_DEFAULT,
    TAGS_TYPE,
} from "../components/search/form/clauses/Tags";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("renders Advanced Data Search without crashing", () => {
    const component = TestRenderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <ConfigProvider>
                    <AdvancedSearchForm />
                </ConfigProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});

test("tests data search Modified clause: default value is removed", () => {
    const clause = { type: MODIFIED_TYPE, args: MODIFIED_ARGS_DEFAULT };
    const result = clearEmptyValues([clause]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

test("tests data search Modified clause: empty `from` is removed", () => {
    const clause = {
        type: MODIFIED_TYPE,
        args: { from: "", to: "2021-12-10 01:00:00" },
    };
    const result = clearEmptyValues([clause]);
    const expected = [{ type: MODIFIED_TYPE, args: { to: "1639098000000" } }];

    expect(result).toStrictEqual(expected);
});

test("tests data search Modified clause: empty `to` is removed", () => {
    const clause = {
        type: MODIFIED_TYPE,
        args: { from: "2021-12-10 01:00:00", to: "" },
    };
    const result = clearEmptyValues([clause]);
    const expected = [{ type: MODIFIED_TYPE, args: { from: "1639098000000" } }];

    expect(result).toStrictEqual(expected);
});

test("tests data search Modified clause: no values removed", () => {
    const clause = {
        type: MODIFIED_TYPE,
        args: { from: "2021-12-10 01:00:00", to: "2021-12-10 01:00:00" },
    };
    const result = clearEmptyValues([clause]);
    const expected = [
        {
            type: MODIFIED_TYPE,
            args: { from: "1639098000000", to: "1639098000000" },
        },
    ];

    expect(result).toStrictEqual(expected);
});

test("tests data search Label clause: default value is removed", () => {
    const clause = { type: LABEL_TYPE, args: LABEL_ARGS_DEFAULT };
    const result = clearEmptyValues([clause]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

test("tests data search Label clause: no values removed", () => {
    const clause = {
        type: LABEL_TYPE,
        args: { label: "myLabel", exact: false },
    };
    const result = clearEmptyValues([clause]);

    expect(result).toStrictEqual([clause]);
});

test("tests data search Size clause: default value is removed", () => {
    const clause = { type: SIZE_TYPE, args: SIZE_ARGS_DEFAULT };
    const result = clearEmptyValues([clause]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

test("tests data search Size clause: empty `from` is removed", () => {
    const clause = {
        type: SIZE_TYPE,
        args: {
            from: { value: "", unit: "MB" },
            to: { value: "2", unit: "MB" },
        },
    };
    const result = clearEmptyValues([clause]);
    const expected = [{ type: SIZE_TYPE, args: { to: "2MB" } }];

    expect(result).toStrictEqual(expected);
});

test("tests data search Size clause: empty `to` is removed", () => {
    const clause = {
        type: SIZE_TYPE,
        args: {
            from: { value: "2", unit: "MB" },
            to: { value: "", unit: "MB" },
        },
    };
    const result = clearEmptyValues([clause]);
    const expected = [{ type: SIZE_TYPE, args: { from: "2MB" } }];

    expect(result).toStrictEqual(expected);
});

test("tests data search Size clause: no values removed", () => {
    const clause = {
        type: SIZE_TYPE,
        args: {
            from: { value: "2", unit: "MB" },
            to: { value: "5", unit: "MB" },
        },
    };
    const result = clearEmptyValues([clause]);
    const expected = {
        type: SIZE_TYPE,
        args: {
            from: "2MB",
            to: "5MB",
        },
    };

    expect(result).toStrictEqual([expected]);
});

test("tests data search Metadata clause: default value is removed", () => {
    const clause = { type: METADATA_TYPE, args: METADATA_ARGS_DEFAULT };
    const result = clearEmptyValues([clause]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

test("tests data search Metadata clause: empty `attribute` is removed", () => {
    const clause = {
        type: METADATA_TYPE,
        args: { attribute: "", value: "someValue" },
    };
    const result = clearEmptyValues([clause]);
    const expected = [{ type: "metadata", args: { value: "someValue" } }];

    expect(result).toStrictEqual(expected);
});

test("tests data search Metadata clause: empty `value` is removed", () => {
    const clause = {
        type: METADATA_TYPE,
        args: { attribute: "someValue", value: "" },
    };
    const result = clearEmptyValues([clause]);
    const expected = [{ type: "metadata", args: { attribute: "someValue" } }];

    expect(result).toStrictEqual(expected);
});

test("tests data search Metadata clause: no values removed", () => {
    const clause = {
        type: METADATA_TYPE,
        args: { attribute: "someValue", value: "someValue" },
    };
    const result = clearEmptyValues([clause]);

    expect(result).toStrictEqual([clause]);
});

test("tests data search Owner clause: default value is removed", () => {
    const clause = { type: OWNER_TYPE, args: OWNER_ARGS_DEFAULT };
    const result = clearEmptyValues([clause]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

test("tests data search Owner clause: no values removed", () => {
    const clause = { type: OWNER_TYPE, args: { owner: "someValue" } };
    const result = clearEmptyValues([clause]);

    expect(result).toStrictEqual([clause]);
});

test("tests data search Path clause: default value is removed", () => {
    const clause = { type: PATH_TYPE, args: PATH_ARGS_DEFAULT };
    const result = clearEmptyValues([clause]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

test("tests data search Path clause: no values removed", () => {
    const clause = { type: PATH_TYPE, args: { prefix: "someValue" } };
    const result = clearEmptyValues([clause]);

    expect(result).toStrictEqual([clause]);
});

test("tests data search Permission clause: default value is removed", () => {
    const clause = { type: PERMISSIONS_TYPE, args: PERMISSIONS_ARGS_DEFAULT };
    const result = clearEmptyValues([clause]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

test("tests data search Permission clause: empty `users` list is removed", () => {
    const clause = {
        type: PERMISSIONS_TYPE,
        args: { permission: "write", permission_recurse: true, users: [] },
    };
    const result = clearEmptyValues([clause]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

test("tests data search Permission clause: no values removed", () => {
    const clause = {
        type: PERMISSIONS_TYPE,
        args: {
            permission: "own",
            permission_recurse: true,
            users: ["batman"],
        },
    };
    const result = clearEmptyValues([clause]);

    expect(result).toStrictEqual([clause]);
});

test("tests data search Tags clause: default value removed", () => {
    const clause = {
        type: TAGS_TYPE,
        args: TAGS_ARGS_DEFAULT,
    };
    const result = clearEmptyValues([clause]);
    const expected = [];

    expect(result).toStrictEqual(expected);
});

test("tests data search Tags clause: no values removed", () => {
    const clause = {
        type: TAGS_TYPE,
        args: { tags: ["myTag"] },
    };
    const result = clearEmptyValues([clause]);

    expect(result).toStrictEqual([clause]);
});
