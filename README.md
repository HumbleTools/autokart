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

### Backlog
- find solution for pending status not visible when logging is processing. Due to null user passed to processuser (idea : add new state for logging progress ?? to prevent processing null user and switching to incorrect logged-out mode)
- responsivite ?
- setup overlay for logged-out and pending states + spinner ?
- in the firebase rules, if the roles notion disapears, then isLoggedIn is dangerous. Check the user email in it
- setup menu with links
- setup router with mock pages
- add recipe search
- add recie viewer
- other pages...
- push shopping list to keeper ? only to a specific list (security)
