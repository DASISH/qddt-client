# QDDT Client

*This is a prototype for the web client based on the QDDT API being developed at NSD. This prototype uses experimental software in alpha versions. Primarily Angular 2 alpha releases and based on Typescript.*

Basic features:

* Login and logout
* A dashboard
* Create survey programs
* See last comments

As this project is based on highly experimental software, it is to be considered a prototype that can be discarded at any time if during the process of development should it become obvious that it is not giving us the results we are expecting.

## Development  
To run the application for local development, start it with ``npm start``.   
and wait for it to start. You should see this as an indication that it started:  
```javascript
Finished 'serve' after 3.72 s
```
Wait for the API to be released, or write and pull request with a mock based API if you feel you need that.

### State of tests
Currently, all tests are either default implementations that do nothing, or very basic tests. These tests will be created as the project mature, but for now, the project is experimental in nature and tests are not justified for now.

## Contributions
Contributions are open for anyone willing and able to contribute. However, we are currently not planning on providing mocks for any of our application level services. You must either write these mocks on your own, or wait for the API to be released on github.

### Structure
All modules with all their services and support classes, including test cases, should be grouped together in the same directory. Exceptions are common components such as templates or elements that will be featured multiple places throughout the application. Specifically elements that draw information.

```
├──app  
|	├──common  
|  	|	├──templates
|  	|	└──elements
| 	├──components  
|  	|	├──component_1
|   |		├──component.html
|  	|		├──component.ts
|  	|		└──component_spec.ts
| 	├──component_n  
|  	├──services
|   |
|   ├──bootstrap.ts
|   ├──index.html
|   ├──system.config.js
|   └──typings.d.ts
├──tools
└──project_files...
```
Follow this structure for now. Please, feel free to submit changes to this structure, but expect to be asked to provide a valid argument of why this should be changed.

### Submitting Pull Requests

**Please follow these basic steps to simplify pull request reviews - if you don't you'll probably just be asked to anyway.**

* Please rebase your branch against the current master
* Run ```npm install``` to make sure your development dependencies are up-to-date
* Please ensure that the test suite passes **and** that code is lint free before submitting a PR by running:
 * ```npm test```
* If you've added new functionality, **please** include tests which validate its behaviour
* Make reference to possible [issues] on PR comment

### Submitting bug reports

* Please detail the affected browser(s) and operating system(s)
* Please be sure to state which version of node **and** npm you're using

## Credits

Based on https://github.com/mgechev/angular2-seed/  
We will follow changes here as well, and implement big changes to our tool chain as they appear.
