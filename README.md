# Se7en-Scheduler

#### The Platform
This project is a web-based platform for SUTD instructors and coordinators to generate and manage academic schedules. It seeks to minimise clunky communication by email by providing a common platform for instructors to enrol courses for the upcoming schedule, allow coordinators to utilise a smart event scheduling algorithm to generate the term's schedule and for both end-users to communicate with each other based on the tasks at hand. Furthermore, coordinators will be able to ad-hoc events while all users will be able to view and integrate the respective schedules into their personal calendars (e.g. Google Calendar).

#### The Algorithm
The algorithm generates a conflict-minimising schedule using genetic algorithms...elab plz

#### Features implemented 
* Schedule generator using smart scheduling algorithm
* Display, delete generated master schedule
* Display generated schedule based on pillars 
* Add, display, delete Schedule Information (includes term and year of schedule) 
* Add, display, delete Courses in a particular schedule (includes hard constraints) 
* Add, display, delete ad hoc Events in a particular schedule (by Coordinator) 
* Add, display, delete Announcements (from Coordinator to Instructor) 
* Add, display, delete Appeals to generated schedule (from Instructor to Coordinator) 
* Add new user (by Coordinator)
* Log in and log out functionality 
* Change password (protection against misuse cases)

#### To be integrated 
* Downloading of `.csv` file for integration with Google Calendar
* API calls for Events, Appeals

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
The project has dependencies that require [Node 6.9.0](https://nodejs.org/en/download/) or higher, together with [NPM](https://www.npmjs.com/get-npm) 3 or higher. You will also need Angular CLI which you can get by running in the Terminal:

```npm install @angular/cli```

### Installing
After cloning the project,

``` 
cd frontend/scheduler/src
ng build
```

## Testing

Testing is split into 3 main components: algorithm used to generate schedules, frontend and backend. 

### Algorithm Testing

Explain what these tests test and why

```
Give an example
```

### Frontend - System Testing

End to end testing of the website is done using Selenium in Python 3. To run,

```
cd frontend/testing
python3 SystemsTest.py
```
This test covers 
* Test of login and logout functionality
* Test of page navigations
* Test of forms (e.g. adding a new schedule)

### Backend Testing

Explain what these tests test and why

```
Give an example
```


## Deployment

1) Enable connection to the server, 
```/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --explicitly-allowed-ports=6666```

2) In the Chrome window that opens, paste the url 
```http://localhost:4200/home```

3) Then in the terminal,
```ng serve --port 4200```

## Built With

* [Angular](https://angular.io/) - The web framework used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [FullCalendar](https://fullcalendar.io/docs/typescript/) - Calendar Viewer 
* [Jasmine](https://jasmine.github.io/) - Frontend unit testing tool
* [Selenium](http://www.seleniumhq.org/) - System testing tool

## Authors

* **Angelia Lau** - *1002417* - [angelialau](https://github.com/angelialau)
* **Rayson Lim** - *1002026* - [nosyarlin](https://github.com/nosyarlin)
* **Tham Yee Ting** - *1002516* - [thamyeeting](https://github.com/thamyeeting)
* **Wu Yu Fei** - *1002192* - [RafaelaWu](https://github.com/RafaelaWu)

## Acknowledgments

* StackOverflow always...
* Countless tutorials...

