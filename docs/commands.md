# Commands  
Here's the list of Plex's commands! 

#### Contents of the table  
**Name**: The name of the command  
**Description**: A brief explanation of the purpose of the command  
**Usage**: The arguments/options that the command takes in parameters  
 **Aliases** Other commands names that will run the same command 
**Cooldown**: The time that must elapse between each command so that it can be executed again by the user

### Moderation (5 commands)

| Name       | Description      | Usage                                 | Aliases       | Cooldown  |
| ---------- | ---------------- | ------------------------------------- | ------------- | --------- |
| **ban**    | Bans a member    | !ban \<user> \<reason>                | banish        | 1 seconds |
| **kick**   | Kicks a member   | !kicks \<user> \<reason>              | None          | 1 seconds |
| **mute**   | Mutes a member   | !mute \<user> \<reason|time> [reason] | silence       | 1 seconds |
| **unmute** | Unmutes a member | !unmute \<user>                       | unsilence, um | 1 seconds |
| **warn**   | Warns a member   | !warn \<user> \<reason>               | strike        | 1 seconds |

### Config (5 commands)

| Name              | Description                                                     | Usage      | Aliases                        | Cooldown   |
| ----------------- | --------------------------------------------------------------- | ---------- | ------------------------------ | ---------- |
| **config**        | Runs through bot configuration                                  | !config    | None                           | 30 seconds |
| **ignoreChannel** | Blacklists a channel                                            | [channel]  | ignore-channel, ignore_channel | 3 seconds  |
| **nickname**      | Set/View the bots nickname                                      | [nickname] | nick                           | 3 seconds  |
| **prefix**        | Set the prefix with the set arg, or see the prefix with no args | [prefix]   | px                             | 3 seconds  |
| **xpconf**        | Set/View the current xp setting                                 | [on/off]   | nick                           | 3 seconds  |

### Dev (3 commands)

| Name               | Description                                       | Usage | Aliases | Cooldown  |
| ------------------ | ------------------------------------------------- | ----- | ------- | --------- |
| **cp**             | Dev command that emeulated a second terminal      | N/A   | None    | 3 seconds |
| **guildMemberAdd** | Dev command that emeulates a guildMemberAdd event | N/A   | None    | 3 seconds |
| **levelUpChannel** | Dev command that emeulates a levelUpChannel event | N/A   | None    | 3 seconds |

### General (1 commands)

| Name     | Description   | Usage | Aliases | Cooldown  |
| -------- | ------------- | ----- | ------- | --------- |
| **ping** | Gets the ping | N/A   | None    | 3 seconds |

