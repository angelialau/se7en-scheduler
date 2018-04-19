# Se7en-Scheduler

#### The Platform
This project is a web-based platform for SUTD instructors and coordinators to generate and manage academic schedules. It seeks to minimise clunky communication by email by providing a common platform for instructors to enrol courses for the upcoming schedule, allow coordinators to utilise a smart event scheduling algorithm to generate the term's schedule and for both end-users to communicate with each other based on the tasks at hand. Furthermore, coordinators will be able to ad-hoc events while all users will be able to view and integrate the respective schedules into their personal calendars (e.g. Google Calendar).

#### The Algorithm
The algorithm generates a conflict-minimising schedule using genetic algorithms. Once the Coordinator click the generate schedule button, the courses details are passed to the algorithm. The algorithm then record course data and generate schedules that ensure no conflict between professors, rooms and classes. All generated schedules then pass through a checkScore function to calculate the conflicts between different terms (e.g. term 7 and term 5). The algorithm will then mutate the params(genes) of the top 10 schedules with minimal scores. In the next round, the schedule is generated using the mutated params. After 5 rounds, the schedule with the highest score(minimal conflict)will be output to the backend.

#### Features implemented 
* Schedule generator using smart scheduling genetic algorithm (supports Capstone, ISTD, EPD, ESD, HASS)
* GUI implementation to generate schedule
* Display, delete generated master schedule
* Display generated schedule based on pillars 
* Add, display, delete Schedule Information (includes term and year of schedule) 
* Add, display, delete Courses in a particular schedule (includes hard constraints) 
* Add, display, delete ad hoc Events in a particular schedule (by Coordinator) 
* Add, display, delete Announcements (from Coordinator to Instructor) 
* Add, display, delete Appeals to generated schedule (from Instructor to Coordinator) 
* Reply appeals (from Coordinator to Instructor)
* Add new user (by Coordinator)
* Log in and log out functionality 
* Change password (protection against misuse cases)
* Download calendar in CSV format for integration to Google Calendar

#### To be integrated 
* Algorithm needs to support error handling
* Calendar needs allow manual editing

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
The project has dependencies that require [Node 6.9.0](https://nodejs.org/en/download/) or higher, together with [NPM](https://www.npmjs.com/get-npm) 3 or higher. You will also need Angular CLI which you can get by running in the Terminal:

```
npm install @angular/cli
```

### Installing
After cloning/forking the project,

``` 
cd frontend/scheduler/src
ng build
```

## Testing

Testing is split into 3 main components: algorithm used to generate schedules, frontend and backend. 

### Algorithm Testing - Unit Testing, Robustness Testing

Unit testing is done using python unittest. To run,

```
cd backend
python3 TestAlgo.py
```
This test covers all algorithm functions that can be tested separately.

### Frontend - System Testing

End to end testing of the website, done using Selenium in Python 3. To run,

```
cd frontend/scheduler/src
ng serve 
cd ../../testing
python3 SystemsTest.py
```
This test covers 
* Test of login and logout functionality
* Test of page navigations
* Test of user rights (instructors cannot access features requiring administrative rights)
* Test of forms (e.g. adding a new schedule)

### Frontend - Unit Testing

Unit tests of Angular2 components in Jasmine framework. To run,

```
cd frontend/schedule/src
np test
```
This test involves isolated tests of components (includes child components): 
* Authentication, Announcement, Schedules, Courses, Events, Changing password, Adding users

It tests dependency injections, instantiation of variables, objects and forms, as well as (at least) black box testing of helper functions for the forms.

### Backend Testing 

Unit testing is done using Mocha and Chai. API endpoint testing is done using Postman. 

Steps to run mocha:
```
cd backend
npm test
```

This test covers
* All utility functions (eg. checking if JSONObjects have identical keys)

Tests on Postman tries all API endpoints and check if the response is correct. Here is an example of a Postman test,
```
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response must be valid and have a body", function () {
     // assert that the status code is 200
     pm.response.to.be.ok; // info, success, redirection, clientError,  serverError, are other variants
     // assert that the response has a valid JSON body
     pm.response.to.be.withBody;
     pm.response.to.be.json; // this assertion also checks if a body  exists, so the above check is not needed
     pm.response.to.not.have.jsonBody("message");
});

pm.test("No Errors found", function () {
    pm.response.to.not.be.error; 
    pm.response.to.have.jsonBody(""); 
    pm.response.to.not.have.jsonBody("error"); 
});

pm.test("Check known user was pulled", function () {
    pm.expect(pm.response.text()).to.include("Rayson Lim");
});
```
This test covers
* status code
* response body 
* errors 
* expected result. 

## Deployment

1) Enable connection to the server, 
```/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --explicitly-allowed-ports=6666```

2) In the Chrome window that opens, paste the url 
```http://localhost:4200/home```

3) Then in the terminal,
```ng serve --port 4200```

## Built With

* [NodeJS](https://nodejs.org/en/) - The JavaScript execution engine
* [Angular](https://angular.io/) - The web framework used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [FullCalendar](https://fullcalendar.io/docs/typescript/) - Calendar Viewer 
* [Jasmine](https://jasmine.github.io/) - Frontend unit testing framework
* [Karma](https://karma-runner.github.io/2.0/index.html) - Frontend unit testing test runner
* [Selenium](http://www.seleniumhq.org/) - System testing tool
* [MySQL](https://www.mysql.com) - Database system 
* [phpMyAdmin](https://www.phpmyadmin.net) - Database management
* [Postman](https://www.getpostman.com) - API endpoint testing tool
* [Mocha](https://mochajs.org) - Backend unit testing framework

## Authors

* **Angelia Lau** - *1002417* - [angelialau](https://github.com/angelialau)
* **Rayson Lim** - *1002026* - [nosyarlin](https://github.com/nosyarlin)
* **Tham Yee Ting** - *1002516* - [thamyeeting](https://github.com/thamyeeting)
* **Wu Yufei** - *1002192* - [RafaelaWu](https://github.com/RafaelaWu)

## Acknowledgments

* StackOverflow always...
* Countless tutorials...
* Sleepless nights...

