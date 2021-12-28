## Run application & reproduce issues

Run `npm install` to install dependencies.

Run `serve:plugins` to serve app with remote entry. Navigate to `http://localhost:4201/`. The app hosting remote entries will be opened. Here the home button, locate button and scale are working as expected.

Run `serve:app` to serve app that consumes remote entries. Navigate to `http://localhost:4200/`. Here the home button, locate button and scale are not working at all and console is filled with errors like this one:

"Logger.js:5 [esri.core.Accessor] Accessor#set Assigning an instance of 'esri.geometry.SpatialReference' which is not a subclass of 'esri.geometry.SpatialReference".


