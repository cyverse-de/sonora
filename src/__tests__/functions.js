import { camelcaseit } from "../common/functions";

it("camelcases a simple object", () =>
    expect(camelcaseit({ "foo-bar": "baz" })).toStrictEqual({ fooBar: "baz" }));

it("camelcase a nested object", () => {
    const original = {
        "foo-bar": "baz",
        nested: {
            "test_camel-case": "works",
        },
    };

    const expected = {
        fooBar: "baz",
        nested: {
            testCamelCase: "works",
        },
    };

    expect(camelcaseit(original)).toStrictEqual(expected);
});

it("camelcaseit handles lists", () => {
    const original = {
        fooBar: [
            {
                "foo-bar": "baz",
            },
        ],
    };

    const expected = {
        fooBar: [
            {
                fooBar: "baz",
            },
        ],
    };

    expect(camelcaseit(original)).toStrictEqual(expected);
});

it("camelcaseit handles lists with multiple items", () => {
    const original = {
        fooBar: [
            { "foo-bar": "baz" },
            { "another_test-yay": "1" },
            { "one-two_Three": "2 " },
        ],
    };

    const expected = {
        fooBar: [
            { fooBar: "baz" },
            { anotherTestYay: "1" },
            { oneTwoThree: "2 " },
        ],
    };

    expect(camelcaseit(original)).toStrictEqual(expected);
});

it("camelcaseit handles lists with multiple non-object items", () => {
    const original = {
        fooBar: ["do-not-modify", "do_not_modify", "do_not-Modify"],
    };

    const expected = {
        fooBar: ["do-not-modify", "do_not_modify", "do_not-Modify"],
    };

    expect(camelcaseit(original)).toStrictEqual(expected);
});

it("camelcaseit handles nested lists with multiple non-object items", () => {
    const original = {
        fooBar: {
            baz: ["do-not-modify", "do_not_modify", "do_not-Modify"],
        },
    };

    const expected = {
        fooBar: {
            baz: ["do-not-modify", "do_not_modify", "do_not-Modify"],
        },
    };

    expect(camelcaseit(original)).toStrictEqual(expected);
});

it("camelcaseit handles top-level arrays", () => {
    const original = [
        {
            one: "1",
        },
        {
            one_two: "1 2",
        },
        {
            one_two_three: {
                nested_1: "nested 1",
                "nested_1-2": "nested 1 2",
            },
        },
    ];

    const expected = [
        {
            one: "1",
        },
        {
            oneTwo: "1 2",
        },
        {
            oneTwoThree: {
                nested1: "nested 1",
                nested12: "nested 1 2",
            },
        },
    ];

    expect(camelcaseit(original)).toStrictEqual(expected);
});
