# TableAssignment

This is a programming assinment. For details on the assignment, see `public/docs/description.md`. 
My report on the assignment can be found under `public/docs/report.md`. 
The documentation of the table module can be found here: [jankolkmeier.github.io/table_assignment](https://jankolkmeier.github.io/table_assignment/). 
A live version may still be running [here](https://tableassignment.kolkmeier.com/).

This project is a docker container that can be used with VSCodes Dev Container features. 
The angular project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.1.

## Development server
Run `ng serve --poll 500` to host the application using the dev server.
The port is `:4342`. This container is configured to forward this port to your machine.
The application should be available under `http://localhost:4342/` once the dev server is running.

Note that for Dev Container compatibility, this dev server is configured to listen to host 0.0.0.0 (all interfaces). So beware if you're running this outside of a docker container.
