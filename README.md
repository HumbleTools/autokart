# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# AutoKart
Let your shopping kart go full auto.

## Firebase cli commands help
### configure more firebase tools
`firebase init`
### Login cli
`firebase login`
### deploy app on firebase hosting
`firebase deploy`
### Deploy only your .rules file
`firebase deploy --only firestore:rules`
### Extract indexes
`firebase firestore:indexes`
### Deploy only your .indexes file
`firebase deploy --only firestore:indexes`

## Git notes
### Personal project files
The following files should not be modified with personal/project data on a public remote.
- src/firebase-config.ts
- .firebaserc

Make sure you don't push any modification on them, by using the following command :

`git update-index --skip-worktree <file>`

Undo with :

`git update-index --no-skip-worktree <file>`

### Backlogs
## Features
- create recipe screen
-- revoir ingrédients : vue compacte avec popin
-- popin pour erreurs recettes ? meilleur display, pas de déformation etc
-- case à cocher "hors caddie" pour les ingrédients => popin ingredients ? for a shorter form
-- add moving buttons using swap function for ingredient list https://react-hook-form.com/api/usefieldarray/
- Display firstname only ?
- import cookbook
- add custom item to shopping list
- auto-plan proposal (full week ? day ?) to prioritize what has not been done in a while
- auto-plan : seasonal constraints ?
- create an alexa skill to pilot it, add single items to grocery list
- manage a freezer screen, and plan freezer dishes
- enhance grouping shopping items function (plurals ? number of words in common ? synonyms ?)

## Technical
- write full project setup in readme
- configure lint-staged ?
- split css file... use css in ts ? 
- add E2E tests with cypress
- try to fix page jump when keyboard appears on create recipe screen ?
- replace native delete popup by new delete popin + add toaster on deletion + loader
- error messages positions... writerecipe
- isAdmin should be served from userContext

