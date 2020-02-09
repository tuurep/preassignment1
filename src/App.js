import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment'
import { Grid, Paper } from '@material-ui/core';

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
})

const kumpula_coordinates = {
  lat: 60.204812,
  lon: 24.962118
}

const eficode_coordinates = {
  lat: 60.169418,
  lon: 24.925802
}

const PLAN_QUERY = gql`
  query Plan($from_lat: Float!, $from_lon: Float!, $to_lat: Float!, $to_lon: Float!) {
    plan(
      from: {lat: $from_lat, lon: $from_lon}
      to: {lat: $to_lat, lon: $to_lon}
      numItineraries: 6
    ) {
      itineraries {
        startTime
        legs {
          startTime
          mode
          route {
            shortName  
          }
          from {
            name
          }
          to {
            name
          }
        }
      endTime
      duration
      }
    }
  }
`

const style = {
  Paper: {
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center'
  },

  Grid_container: {
  }
}

const Plan = ({ from_lat, from_lon, to_lat, to_lon }) => (
  <Query
    query={PLAN_QUERY}
    variables={{
      from_lat: from_lat,
      from_lon: from_lon,
      to_lat: to_lat,
      to_lon: to_lon
    }}
    pollInterval={500}
  >

    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return `Error: ${error.message}`

      const itineraries = data.plan.itineraries

      return (
        <div>
          {itineraries.map(i => 
            <div>
              <h3>{moment(i.startTime).format("HH:mm")}</h3>
              {i.legs.map(l => 
                <div> 
                  {l.mode !== 'WALK' &&
                    <div>
                      {moment(l.startTime).format("HH:mm")} {' [ '}
                      {l.mode} {' '}
                      {l.mode !== 'SUBWAY' && l.route.shortName} {'] '}
                      {l.from.name} - {l.to.name}
                    </div>
                  }
                </div>
              )}
            </div>
          )}
        </div>
      )
    }}
  </Query>
)

function App() {
  return (
    <Grid container direction="row" justify="center" alignItems="flex-start" spacing={10} style={style.Grid_container}>
      <ApolloProvider client={client}>
        <Grid item sm>
          <Paper elevation={3} style={style.Paper}>
            <h2>Kumpulan kampus - Eficode HQ</h2>
            <Plan
              from_lat={kumpula_coordinates.lat}
              from_lon={kumpula_coordinates.lon}
              to_lat={eficode_coordinates.lat}
              to_lon={eficode_coordinates.lon}
            />
          </Paper>
        </Grid>
        <Grid item sm>
          <Paper elevation={3} style={style.Paper}>
            <h2>Eficode HQ - Kumpulan kampus</h2>
            <Plan
              from_lat={eficode_coordinates.lat}
              from_lon={eficode_coordinates.lon}
              to_lat={kumpula_coordinates.lat}
              to_lon={kumpula_coordinates.lon}
            />
          </Paper>
        </Grid>
      </ApolloProvider>
    </Grid>
  )
}

export default App;
