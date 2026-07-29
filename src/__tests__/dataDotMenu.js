/**
 * @jest-environment jsdom
 */
import React from "react";
import preloadAll from "jest-next-dynamic";
import renderer from "react-test-renderer";

import DataDotMenu from "components/data/toolbar/DataDotMenu";
import ResourceTypes from "components/models/ResourceTypes";

import { EmotionCacheProvider } from "__mocks__/EmotionCacheProvider";
import { RQWrapper } from "__mocks__/RQWrapper";
import { ConfigProvider } from "contexts/config";

import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme/default";

// The shared I18nProviderWrapper loads locales over HTTP and suspends forever
// under jest, so anything rendered inside it never runs. Stub the hook instead
// so this component actually renders and its logic is exercised.
jest.mock("i18n", () => ({
    useTranslation: () => ({ t: (key) => key }),
    Trans: ({ children }) => children,
    i18n: {},
    RequiredNamespaces: [],
}));

// The component calls useRouter during render, which throws outside a Next app.
jest.mock("next/router", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

beforeAll(async () => {
    await preloadAll();
});

const TestProviderWrapper = ({ children }) => (
    <RQWrapper>
        <EmotionCacheProvider>
            <ThemeProvider theme={theme}>
                <ConfigProvider>{children}</ConfigProvider>
            </ThemeProvider>
        </EmotionCacheProvider>
    </RQWrapper>
);

const folder = {
    id: "folder-id",
    path: "/cyverse/home/wregglej/grr",
    type: ResourceTypes.FOLDER,
    permission: "own",
};

// Moving or deleting the selected item out of the folder being viewed leaves
// its ID in `selected` while the refreshed listing no longer resolves it, so
// `selected` can be longer than the resources it maps to.
const cases = [
    { name: "an empty selection", selected: [], resources: [] },
    { name: "a selected folder", selected: [folder.id], resources: [folder] },
    {
        name: "a selection that is no longer listed",
        selected: [folder.id],
        resources: [],
    },
    {
        name: "more selected IDs than resolved resources",
        selected: [folder.id, "also-gone"],
        resources: [folder],
    },
];

test.each(cases)(
    "DataDotMenu renders with $name",
    ({ selected, resources }) => {
        const component = renderer.create(
            <TestProviderWrapper>
                <DataDotMenu
                    baseId="data.toolbar"
                    selected={selected}
                    getSelectedResources={() => resources}
                    uploadEnabled={true}
                    sharingEnabled={true}
                    bagEnabled={true}
                    planCanShare={true}
                    detailsEnabled={selected.length === 1}
                />
            </TestProviderWrapper>
        );
        // Guards against the suspend-forever trap above: if the component were
        // never rendered, there would be no tree to find the menu button in.
        expect(component.root.findAllByType("button").length).toBeGreaterThan(
            0
        );
        component.unmount();
    }
);
