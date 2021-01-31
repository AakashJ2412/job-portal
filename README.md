# Job Portal

This is a job portal webapp that is developed using the MERN stack. There are two types of users - recruiters and applicants. Recruiters can create, edit, and delete job listings, each with their respective parameters, review applications by applicants and choose to shortlist, accept, or reject them, and have various sort/filter functionalities for their employees. Applicants can view all active job listings, apply for a posting, and review their applications.

## How to run

### Prerequisites

* It is assumed that the system has MongoDB community edition downloaded, and nodejs setup, as the webapp uses npm functionalities for both expressJS and react.

### Run the Webapp

* Run Mongo daemon:
```
sudo mongod
```
Mongo will be running on port 27017.


* Run Express Backend:
```
cd backend/
npm install
npm start
```

* Run React Frontend:
```
cd frontend
npm install/
npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser.

