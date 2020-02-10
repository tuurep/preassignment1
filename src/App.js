import React from 'react';
import './App.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { Grid, Paper } from '@material-ui/core';
import bus_icon from './icons/bus.svg';
import metro_icon from './icons/metro.svg';
import tram_icon from './icons/tram.svg';

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
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
      }
    }
  }
`

const styles = {
  Paper: {
    padding: 60,
    paddingBottom: 70,
    margin: 60,
    backgroundColor: '#f5f5f5'
  },
  AlignIconWithText: {
    verticalAlign: 'sub'
  },
  Bordered: {
    border: 'solid',
    borderColor: '#757575',
    backgroundColor: '#eeeeee',
    padding: 10
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
      itineraries.sort((a, b) => a.startTime - b.startTime)

      return (
        <div>
          {itineraries.map(i => 
            <Grid
              container direction="row"
              justify="space-between"
              alignItems="center"  
              spacing={6}
            >
              <Grid item xs={2}>
                <h2>{moment(i.startTime).format("HH:mm")}</h2>
              </Grid>
              <Grid item xs>
                <div style={styles.Bordered}>
                  {i.legs.map(l => 
                    <div> 
                      {l.mode !== 'WALK' &&
                        <div>
                          {l.mode === 'BUS' && 
                            <div>
                              <img src={bus_icon} alt="BUS" style={styles.AlignIconWithText} /> {' '}
                              <font size="5.5" color="#007AC9">{l.route.shortName}</font>
                            </div>
                          }
                          {l.mode === 'TRAM' && 
                            <div>
                              <img src={tram_icon} alt="TRAM" style={styles.AlignIconWithText} /> {' '}
                              <font size="5.5" color="#00985F">{l.route.shortName}</font>
                            </div>
                          }
                          {l.mode === 'SUBWAY' && <img src={metro_icon} alt="METRO" />} {' '}
                          <div style={{ marginTop: 8, marginBottom: 15 }}>
                            <b>{moment(l.startTime).format("HH:mm")} </b> {' '}
                            {l.from.name} &#10140; {l.to.name}
                          </div>
                        </div>
                      }
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={2}>
                <h2>{moment(i.endTime).format("HH:mm")}</h2>
              </Grid>
            </Grid>
          )}
        </div>
      )
    }}
  </Query>
)

function App() {
  return (
    <Grid container 
      direction="row"
      justify="space-evenly"
      alignItems="flex-start"
      spacing={10}
    >
      <ApolloProvider client={client}>
        <Grid item lg>
          <Paper elevation={4} style={styles.Paper}>
            <h1 style={{ textAlign: 'center' }}>
              Kumpulan kampus &#10140; Eficode HQ
            </h1>
            <Plan
              from_lat={kumpula_coordinates.lat}
              from_lon={kumpula_coordinates.lon}
              to_lat={eficode_coordinates.lat}
              to_lon={eficode_coordinates.lon}
            />
          </Paper>
        </Grid>
        <Grid item lg>
          <Paper elevation={4} style={styles.Paper}>
            <h1 style={{ textAlign: 'center' }}>
              Eficode HQ &#10140; Kumpulan kampus
            </h1>
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
