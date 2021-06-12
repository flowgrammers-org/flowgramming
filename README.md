# Flowgramming
A platform-independent graphical authoring tool which allows users to draw and execute programs using flowcharts.

## Why Flowgramming?

For the novice programmer, it is usually difficult to de-link the programming logic from the syntax of the programming language. This often leads to students memorizing code rather than understanding the logic and designing solutions. Flowgramming was built in an effort for beginner and novice programmers to understand programming logic and develop algorithmic thinking & problem solving skills without the hassle of learning the code syntax.

## Features

1. Easy and intuitive to understand and use
2. Platform independent
3. Programming logic support (Condition,Loops,etc.)
4. Chat based input and output window
5. Arrays (1D and 2D)
6. Flexible expressions and all data types (including strings) supported
7. Dedicated variable watch window to see all variable changes
8. Specialized string Functions
9. Function manager allows custom definition of multiple functions
10. Can save and load all developed flowgrams (saved with extension ".fgmin")

## Setting up development environment

-   Clone : `git clone https://git.amrita.edu/corelab-projects/flowgramming/web-app.git flowgramming`
-   Get into Flow2Code directory : `cd flowgramming/`
-   Install all dependencies : `npm i`
-   Run the app : `npm start`

## Overall Flow

-   `main.js` initializes the graph with start and end blocks and presents it as the main function.
-   The user can double-click the link to add blocks to the chart. This calls `addElement.js`
-   The user will be presented with the list of blocks. The block will be added to the graph and displayed with the help of `utility.js`
-   On double-clicking the added block, `events.js` will allow the user to modify details pertaining to the block [like name, type, etc for **declare**]
-   A delete option is also presented when a block is double-clicked and `deletehelper.js` will take care of deletion
-   Functions can be added using an option in the navigation bar. This fires up a new tab using `tab.js` and opens a function manager.
-   With the help of `functions.js`, users can modify/add/delete functions in the function manager.
-   The user can also switch to different functions and add/remove blocks for the same. `main.js` handles switching and updating such contexts.
-   The run button in the navigation bar would invoke `run.js` to run the flowchart.
-   When the flowchart is running, inputs can be fed by the user via the chat window and outputs will be displayed in the same with the help of `chat.js`
-   As each block is run, `run.js` checks for errors which will be displayed as alerts using `swal.js` and the current value of each variable is updated and displayed in the variable watch window with the help of `variable-watch.js`.
-   The user can save and open a flowchart using buttons in the navigation bar with the help of `save.js`
-   Upon clicking the code-convert button in the navigation bar, the entire flowchart is converted to the code of the language specified by the user, using `convert.js` and a language specific file [like `cpp.js`]
-   The entire app is cached to enable offline use ([PWA](http://web.dev/progressive-web-apps/)) through `sw.js`

## Developer Documentation

-   `sw.js`: Caching all of app's contents and serving it offline
-   `gulpfile.js`: Concatenating and minifying source files to production files
-   `addElement.js`: Fires when a link is double-clicked to add blocks [like declare, input, loops, etc] to the page
-   `chat.js`: Enables users to type in inputs and displays outputs
-   `convert.js`: A modular framework to implement code conversion from flow chart
-   `cpp.js`: Code conversion for C++
-   `deleteHelper.js`: Deletes a block on user's demand
-   `events.js`: Utility functions for adding values/ details to a block which fires up when a specific element is double-clicked
-   `functions.js`: Adding, deleting, modifying functions
-   `main.js`: Initializes the graph [adds start and end block], the current context [function displayed] and updates contexts on function selection/modification
-   `run.js`: Fired when run button is clicked. The entire flowchart is compiled and errors/outputs are displayed
-   `save.js`: Exporting flowchart as a fgmin [JSON] file and importing flowchart from a fgmin [JSON] file
-   `swal.js`: Utility functions for modularizing alerts
-   `tab.js`: Utility functions for opening a HTML file in a new tab
-   `utility.js`: Utility functions for getting details of the graph and displaying it as a flowchart
-   `variable-watch.js`: Shows current value for all the variables in the present context
