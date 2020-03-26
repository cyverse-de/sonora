Sonora Tech Stack
=================

## Javascript / React / Material-UI
[React](https://reactjs.org/) is an open-source Javascript library developed by Facebook. 

We chose to use React in Sonora in part because the dev team had already gotten familiar with it in the 
old [Discovery Environment](https://github.com/cyverse-de/ui/) code and found success there.

Additionally, React is declarative, can be functional, has a lot of active support, and a growing 
ecosystem of tools. Their overall philosophy of building small, reusable components was also appealing 
in that it presented the possibility of sharing components across sections of the Discovery Environment
 as well as across CyVerse products.

[Material-UI](https://material-ui.com/) is an open-source React component library built to Google's 
Material Design spec. 
It has helped us accomplish some of the big goals we wanted in the Discovery Environment such as 
accessibility, theming, and mobile-friendliness.  
The look and feel of Material-UI's components also have an element of familiarity which hopefully adds 
to how intuitive Sonora feels to new users.

## NextJs
[NextJs](https://nextjs.org/) is an open-source React framework built by Zeit.  It enables Sonora to have 
server-side rendering, automatic code splitting, browsing history, and pages.  All of which are requested 
features we didn't have in the Discovery Environment.

NextJs also has a really beginner friendly [tutorial](https://nextjs.org/learn/basics/getting-started) 
to help get started.

## Express
[Express](https://expressjs.com/) is an open-source web framework for Node.js and handles requests and 
[routing](https://expressjs.com/en/guide/routing.html) in Sonora.  It allows you to add whatever kind 
of middleware you want for things like body parsing, error handling, logging, etc.

## Keycloak
[Keycloak](https://www.keycloak.org/) is an open-source tool for authentication. It works with LDAP, has
single-sign on capabilities, and can be customized to match a theme. 
We're using [Keycloak Connect](https://github.com/keycloak/keycloak-nodejs-connect) to integrate Keycloak 
into Sonora.
