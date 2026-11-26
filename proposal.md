# Description
3D online first-person shooter game, with two game modes. Free for all, or team verses team.

## Needs to have:
- Rendering using Three.js
- WASD movement in a 3D space, SPACEBAR to jump
- Mouse pointer to look around in a 3D space, centre cursor lock
- Left shift to sprint, increasing movement speed
- Left ctrl to crouch, decreasing movement speed and height
- Corresponding animations for each action that other players are able to see
- Multiple weapons, cycled through using the mouse scroll wheel, or the number keys on the keyboard
- Recoil and spray patterns, recoil is variable for each gun
- A purchasing menu with a credit system that allows you to buy different weapons
- A credit distribution system, allocating more or less credits depending on game results
- Hitboxes that apply different damage and also different damage depending on the gun used
- A matchmaking or lobby system allowing players to join a server or pick a game

## Nice to have
- Selection of maps
- Addition to credit system where if you die, you can spectate the currently alive players and bet on who you think will win (depending on gamemode), potentially earning extra money for the next round
- Use Rapier for 3D collision physics
- Create a node.js backend server using Websockets, this server must run a “headless” version of the physics engine to verify player positions and confirm hits
- Create a database (SQLite) allowing for consistent and stored player data
- Use NPM (Nginx Proxy Manager) to serve Three.js files and secure WebSocket traffic
- Connect the server PC to the world via port forwarding
- Use a 24/7 process manager to ensure the server does not crash, go down, and can reboot
- Possible cosmetics and knives

## Very unlikely, but would be fun
- Build our own anti-cheat