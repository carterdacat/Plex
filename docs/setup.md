# Setup

When setting up, make sure to have these prerequisites

- Node Js 12v or higher installed
- Git installed
- Npm installed
- An understanding of djs, http, ts, and js
- A testing bot token
- A mongodb uri

## Installing

To install, you should fork [Plex](https://github.com/carterdacat/plex), and then clone the [Plex's](https://github.com/carterdacat/plex) master branch into a folder on your local drive.

Once this is complete, open the folder with the cloned branch in any IDE of your choice. I use either webstorm or VSC, but its all up to you.

Then open up a terminal, in your IDE, and run `npm install` to install packages

Once that is finished, create a file in the root of your cloned folder, named `.env`. Inside it put this in it:

```
token=<bot token here>
db=<mongodb uri here>
dev=true
```

> Replace the <...> with the actual data. Don't use strings, as it automatically assigns everything as a string.

## Developing

When developing, there's npm commands that you should know

| Script | Description |
| ----------- | ----------- |
| npm run dev | Runs a dev version of the index.ts. Use this to test things |
| npm run server | Turns on the rest api. This is **REQUIRED** to use the bot, if it is not detected, it will not run. |
| npm run build | Builds the ts into js |
| npm run start | Runs a production build. Calls on the npm run build before running |
| npm run test | Just makes sure everything is connecting alright |

When creating commands, refer to [commands](command.md).

### Publishing

When publishing, follow these steps.

1. Commit all files you want changed locally
2. Push your commits to your forks beta branch
3. Create a pull request from your forks beta branch to [Plex's](https://github.com/carterdacat/plex) beta branch
4. Wait for this to be reviewed. If accepted, it will be pulled into the master branch, and be tested. If is passes, it will be added
5. If your pull request was denied, either fix the problems we asked you to fix, or change your approach.
