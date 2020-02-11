### Preassignment project

This React app fetches queries from [HSL open data interface](https://www.hsl.fi/en/opendata) with [Apollo Client](https://www.apollographql.com/docs/react/). It shows the travel schedules between two locations. 6 plans are shown in ascending order by the closest departure time, updated every 500ms.

Notes: 
* Start/end point Kumpulan kampus refers to the location of the building, but in a travel plan it refers to the bus stop 'Kumpulan kampus', so they're not the same.
* App doesn't fit mobile screen well.

**To run locally:**
* npm install
* npm start
* go to http://localhost:3000/

**See app hosted on AWS Elastic Beanstalk:**
* [http://tuurep-timetables.eu-north-1.elasticbeanstalk.com](http://tuurep-timetables.eu-north-1.elasticbeanstalk.com)

**Docker Hub repository:**
* https://hub.docker.com/r/tuurep/timetables