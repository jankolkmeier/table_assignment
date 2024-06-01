# TableAssignment

This is a programming assinment. For details on the assignment, see `public/docs/description.md`. 
My report on the assignment can be found under `public/docs/report.md`. 
The documentation of the table module can be found here: [jankolkmeier.github.io/table_assignment](https://jankolkmeier.github.io/table_assignment/). 

The angular project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.1.

## Live Demo
A live version may still be running [here](https://tableassignment.kolkmeier.com/).

## Use with as VSCode Dev Container
This project is a docker container that can be used with [VSCode's Dev Container](https://code.visualstudio.com/docs/devcontainers/containers) feature. 
Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop) and the [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed for VSCode.

Clone this project and open the folder with VSCode, then press `ctrl+shift+p` and run `Dev Containers: Rebuild and Reopen in Container`. This will take a while for the first time.
This should also install all the project dependencies (i.e it automatically runs `npm install`).

Then open a terminal in the dev container and follow the instructions under `Development Server`.

## Run without a Dev Container
Make sure you have a compatible node version and the angular v18 client installed. If not, follow [these instructions](https://angular.dev/tutorials/first-app#local-development-environment).

Clone this project and open a terminal inside the project folder. Run `npm install` to install all dependencies.
Then follow the instructions under `Development Server`.

## Running Development Server
Run `ng serve --poll 500` to host the application using the dev server.
The port is `:4342`. This container is configured to forward this port to your machine.
The application should be available under `http://localhost:4342/` once the dev server is running.

Note that for Dev Container compatibility, this dev server is configured to listen to host 0.0.0.0 (all interfaces). So beware if you're running this outside of a docker container.