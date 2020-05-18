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

All text displayed to the user should be internationalized. We currently use [react-intl](https://github.com/formatjs/react-intl) for internationalization of our app. There are [helper functions](https://github.com/cyverse-de/ui-lib/blob/master/src/util/I18NWrapper.js) in the [ui-lib](https://github.com/cyverse-de/ui-lib) repo that should be used.

Generally, you'll need to:

1. Create a `messages` file similar to the following with all the text your component(s) will need. Generally, the first 3 lines don't change - `locales` and `messages` must be present. Beyond that, you have your text in key-value pairs.

```
export default {
    locales: "en-US",
    messages: {
        header: "Welcome",
        namedHeader: "Welcome back {name}",
        stringTitle: "Something that's not an object",
    }
}
```

2. Export your component while wrapping it with the `withI18N` [higher-order component](https://reactjs.org/docs/higher-order-components.html) from the [helper function](https://github.com/cyverse-de/ui-lib/blob/master/src/util/I18NWrapper.js) file in the `ui-lib` repo and pass in the `messages` file you created. This basically links them together so `react-intl` knows where to look up text.

```
import React from "react";
+import intlData from "./messages";
+import { withI18N } from "@cyverse-de/ui-lib";

function MyComponent(props) {
    return (
        <>
            <span>Welcome</span>
            <span>Welcome back {props.name}</span>
        </>
    )
}

-export default MyComponent;
+export default withI18N(MyComponent, intlData);

```

3. Update your component to fetch the internationalized text with the corresponding key you created. The [getMessage(key)](https://github.com/cyverse-de/ui-lib/blob/78880901c263c14ea697a5abd9b607fbd776ec4b/src/util/I18NWrapper.js#L29-L34) helper function covers roughly 80% of the use cases

```
import React from "react";
import intlData from "./messages";
-import { withI18N } from "@cyverse-de/ui-lib";
+import { getMessage, withI18N } from "@cyverse-de/ui-lib";

function MyComponent(props) {
    return (
        <>
-            <span>Welcome</span>
-            <span>Welcome back {props.name}</span>
+            <span>{getMessage("header")}</span>
+            <span>{getMessage("namedHeader", {values: {name: props.name}})}</span>
        </>
    )
}

export default withI18N(MyComponent, intlData);
```

4. Since `getMessage` returns the [FormattedMessage](https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage) component/object, you may have cases where your component or an attribute, for example, only accepts a direct string. For those cases, you can use `formatMessage` like so:

```
import React from "react";
import intlData from "./messages";
-import { getMessage, withI18N } from "@cyverse-de/ui-lib";
+import { formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
+import { injectIntl } from "react-intl";

function MyComponent(props) {
    return (
        <>
-            <span>{getMessage("header")}</span>
+            <span
+                title={formatMessage(props.intl, "stringTitle")}
+            >
+                {getMessage("header")}
+            </span>
            <span>{getMessage("namedHeader", {values: {name: props.name}})}</span>
        </>
    )
}

-export default withI18N(MyComponent, intlData);
+export default withI18N(injectIntl(MyComponent), intlData);

```

If you have multiple components exported from a single file (not unusual if you want to test a sub-component separately), make sure that you have i18n-wrapped versions of the sub-components exported. That enables you to write Stories in Storybook for the sub-components without having to set up an i18n decorator. The unwrapped version of the sub-component can still be used by the parent components, which should pass in the `messages` and/or `intl` prop to the i18n-ized child components.

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
- First Link your github account to chromatic.
- Then Go to https://github.com/settings/tokens and create a Personal Access Token and name it chromatic.
- Next go to https://github.com/<username>/sonora/settings/secrets and create 2 secrets. 
- 1 for your personal token (created in first step) and next one for chromatic project token which can be found in Chromatic settings page.

## Pull Requests
Before you submit a PR, make sure to set up Chromatic.
Pull requests should include at minimum 2 screenshots: a desktop version and a mobile version.  FireFox has a button you can click to enter their "Responsive Design Mode" to toggle a mobile view.

It's recommended that 2 developers review each major pull request though there's flexibility there as needed.

### Before you submit
1. Your component should meet all of the above and align with our UI/UX [goals](#ui--ux-goals)
1. Tests should pass - `npm test`
1. Lint checking should pass - `npm run lint`
1. package-lock.json should be updated and committed (if necessary)
