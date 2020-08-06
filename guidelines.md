# Sonora Contribution Guidelines

- [Design and Styling](#design-and-styling)
  - [UI / UX Goals](#ui--ux-goals)
  - [Initial Design or Design Changes](#initial-design-or-design-changes)
  - [Responsive Design](#responsive-design)
  - [Component Design and Icons - Material-UI](#component-design-and-icons---material-ui)
  - [Colors and the CyVerse palette](#colors-and-the-cyverse-palette)
  - [Theming](#theming)
- [Development](#development)
  - [Storybook Development](#storybook-development)
  - [Tests](#tests)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Static IDs](#static-ids)
  - [CSS](#css)
- [Chromatic Setup](#chromatic-setup)
- [Pull Requests](#pull-requests)
  - [Before you submit](#before-you-submit)


## Design and Styling

### UI / UX Goals
> See [Slack's Design System](https://slack.engineering/the-gradual-design-system-how-we-built-slack-kit-8a2830484259)

Everything added to Sonora should help push forward these goals:

* Robust: Components should look great, representing the high standards we set for our product design.
* Accessible: Components should work for all of our users, regardless of how they navigate and interact with our software.
* Flexible: Components should support a variety of use cases within our product, while supporting future extensibility.
* Reliable: Components should be well-tested, dependable, and immediately responsive to user interaction.

### Initial Design or Design Changes
Any major design changes should be discussed and finalized in one of our weekly de-ux meetings with our graphic designer.

### Responsive Design

Sonora will focus on being mobile-friendly.

Material-ui has a lot of resources to make sure the design is responsive:
* [Responsive UI Guide](https://material-ui.com/guides/responsive-ui/): A list of tools material-ui has for helping with responsive layouts
* [Breakpoints](https://material-ui.com/customization/breakpoints/): A breakpoint defines a point in the screen size where the layout should change
* [Sizing](https://material-ui.com/system/sizing/): How to size a component relative to its parent without using explicit sizes
* [Spacing](https://material-ui.com/customization/spacing/): How to create space around components without using explicit sizes.  See additional [Spacing notation and transformation](https://material-ui.com/system/spacing/)

### Component Design and Icons - Material-UI

Use [material-ui](https://material-ui.com) components before attempting to design your own. Material-ui, or MUI, has most of the components we'll need, like [buttons](https://material-ui.com/components/buttons/), [dialogs](https://material-ui.com/components/dialogs/), and [grid layouts](https://material-ui.com/components/grid/). If a component is not available directly from material-ui, you can typically find a repo on github that has created a component that follows the [material-ui design spec](https://material.io/design/) for you.

Use [material icons](https://material-ui.com/components/material-icons/) before asking our graphic designer to create something custom.

### Colors and the CyVerse palette

Stick with using colors from the [CyVerse palette](https://wiki.cyverse.org/wiki/display/COM/CyVerse+Color+Palette) (in order to access that link, you must be signed in and be a CyVerse staff member).

We have defined the palette for code use in the `ui-lib` repo [here](https://github.com/cyverse-de/ui-lib/blob/master/src/util/CyVersePalette.js).

### Theming

Sonora has a [customized material-ui theme](/src/components/theme/default/index.js) to update material-ui components to use the CyVerse palette.

The default material-ui values can be found [here](https://material-ui.com/customization/default-theme/).


## Development


### Storybook Development

It is strongly recommended that all development for components is done utilizing [Storybook](https://storybook.js.org/). Follow the new [Component Story Format](https://storybook.js.org/docs/formats/component-story-format/).

Add your component's story within the `/stories` folder [here](/stories).

Storybook allows you to view your collection of components in a browser and "develop UI components in isolation without worrying about app specific dependencies and requirements". Every time you save your component's story file, Storybook will automatically refresh the browser with your changes so you can visually inspect and iterate on it.


### Tests

Create a test for your component(s) located in the [/src/__tests__](/src/__tests__) folder. Note that all component tests rely on rendering the story for each component which then creates a snapshot.


### Internationalization (i18n)

All text displayed to the user should be internationalized. We currently use [i18next](https://www.i18next.com) and [next-i18next](https://github.com/isaachinman/next-i18next) for internationalization of our app.

Generally, you'll need to:

1. Create a `translation` json file under `/public/static/locales/en` similar to the following with all the text your component(s) will need. The files needs be in JSON format and be saved with `.json` extension.

```
{
    "cyverse": "CyVerse",
    "dashboard": "Dashboard",
    "welcome" : "Welcome {{name}}",
    "data": "Data",
    "deTitle": "Discovery Environment",
    "discovery": "<b>D</b>iscovery"
    }
```

2. Import required translation json file(s) into your react component with filename used as namespace. For example, if you have named the translation files `common.json` and `search.json`, you can import those translations as 

  `const { t } = useTranslation(["common", "search"]);`

3. Once you have imported the translation files, you can use them in your react component.
```
import React from "react";
+import { useTranslation } from "i18n";

function MyComponent(props) {
 +const { t } = useTranslation(["common", "search"]);
  const name = getUserName();
    return (
        <>
 -           <span>`Welcome ${name}`</span>
 -           <span>Discovery Environment</span>
 +           <span>{t("welcome",{ name: name })}
 +           <span>{t("deTitle")}</span>
        </>
    )
}
export default MyComponent;
```
4. Finally, make sure to add the tranlation namespace to the nextjs page `getInitialProps` to prevent it from downloading unnecessary tranlation files.
```
export default function MyPage() {
    return <MyComponent />;
}

MyPage.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, namespacesRequired: ["common", "search"] };
};
```


### Static IDs

For robust QA testing, add static IDs to all of your components.

All ids should be in a separate `ids` file. Example file [here](/src/components/appBar/ids.js).

In order to ensure uniqueness of those IDs, use a pattern of `parentID.childId`. For example, a dialog may have an ID of `toolsDialog`. Every component within that dialog will then have an ID in the format `toolsDialog.myID`. If those components then have sub-components, they will take the format `toolsDialog.myID.theirID`, and so on.

To help with this, there's a `build` helper function in the `ui-lib` repo [here](https://github.com/cyverse-de/ui-lib/blob/master/src/util/DebugIDUtil.js). `build(id1, id2, id3)` will yield an id of `id1.id2.id3`.


### CSS

If your component(s) require a lot of CSS, create a separate `styles` file to keep things minimal. Example file [here](/src/data/listing/styles.js).

For utilizing styles, use `makeStyles` from `@material-ui/core` as a hook. Here's a small example of using `makeStyles`:

```
import { makeStyles } from "@material-ui/core";
import myStylesFile from "./styles";

const useStyles = makeStyles(myStylesFile);

function myComponent(props) {
  const classes = useStyles();

  return (
    <div className={classes.myDivCSS}/>
    )
}
```

## Chromatic Setup
- First, log into https://www.chromatic.com using your github account.
- Next, go to https://github.com/settings/tokens and create a Personal Access Token and name it chromatic. No scopes need to be explicitly granted to this access token.
- Finally, go to https://github.com/username/sonora/settings/secrets and create 2 secrets (replace username with your github account name).
  - One for the GitHub personal access token (created in previous step). Name it `my_token`
  - Another one for chromatic project token which can be found in the Chromatic project settings page for `cyverse-de/sonora` (accessed by clicking the `Manage` link from the project in Chromatic). Name it `project_token`

## Pull Requests
Before you submit a PR, make sure to set up Chromatic.
Pull requests should include at minimum 2 screenshots: a desktop version and a mobile version.  FireFox has a button you can click to enter their "Responsive Design Mode" to toggle a mobile view.

It's recommended that 2 developers review each major pull request though there's flexibility there as needed.

### Before you submit
1. Your component should meet all of the above and align with our UI/UX [goals](#ui--ux-goals)
1. Enusre the code passes the tests, meets linting and formatting requirements by running
`npm run check`
1. package-lock.json should be updated and committed (if necessary)
