# Kinergy_Admin_UI

## Project Info.

### Name of the Project:

Kinergy

### Basic Info:

This product is helpful for doctor appointment operations.

### Steps to use:

1. Clone.
2. Make necessary changes.
3. Done.

# Broader Technologies/libraries/packages used

1. React.JS - For building UI blocks and organising the application
2. Redux - For maintaining the state of the application.
3. Formik - To work with forms in the application.
4. Yup - To enforce validations with forms in the application.
5. Moment - To work with date and timestamps in the application.
6. Axios - To make HTTP calls from the Frontend.
7. MUI - To make HTTP calls from the Frontend.

## Running the project

1. Install [Yarn](https://yarnpkg.com) in the machine.
2. Clone the project `https://github.com/Kinergy-Development/Kinergy_Admin_UI.git`.
3. CD into the project.
4. Install dependencies `yarn install`.
5. Run `yarn run start`.
    1. Dev : `yarn run start` / `yarn run start:dev`
    2. Local : `yarn run start:local`.
    3. Test: `yarn run start:test`.
    4. UAT: `yarn run start:uat`.
    5. PROD: `yarn run start:prod`.
6. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

## Adding a new environment

1. Add a file with name `.env.ENVIRONMENT_NAME` under environments folder.
2. copy contents from `.env.template` file into newly created environment file and edit the values as per requirements.
3. add necessary run/build commands in package.json scripts section.

## Building the project

To build the project we can use build command like below

1. Dev : `yarn run build` / `yarn run build:dev`
2. Local : `yarn run build:local`.
3. Test: `yarn run build:test`.
4. UAT: `yarn run build:uat`.
5. PROD: `yarn run build:prod`.

## Versioning

1. Patch version: `yarn version --patch`.
2. Minor version: `yarn version --minor`.
3. Major version: `yarn version --major`.
