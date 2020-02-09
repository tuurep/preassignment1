import React from 'react';
import './App.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment'

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

    {({ loading, data }) => {
      if (loading) return <p>Loading...</p>
      const itineraries = data.plan.itineraries
      return (
        <div>
          {itineraries.map(i => 
            <div>
              <h3>Start time: {moment(i.startTime).format("HH:mm")}</h3>
              <ul>
                {i.legs.map(l => 
                  <div> 
                    {l.mode !== 'WALK' &&
                      <li>
                        {moment(l.startTime).format("HH:mm")} {' [ '}
                        {l.mode} {' '}
                        {l.mode !== 'SUBWAY' && l.route.shortName} {'] '}
                        {l.from.name} - {l.to.name}
                      </li>
                    }
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>
      )
    }}
  </Query>
)

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>Kumpulan kampus - Eficode HQ</h2>
        <Plan
          from_lat={kumpula_coordinates.lat}
          from_lon={kumpula_coordinates.lon}
          to_lat={eficode_coordinates.lat}
          to_lon={eficode_coordinates.lon}
        />

        <h2>Eficode HQ - Kumpulan kampus</h2>
        <Plan
          from_lat={eficode_coordinates.lat}
          from_lon={eficode_coordinates.lon}
          to_lat={kumpula_coordinates.lat}
          to_lon={kumpula_coordinates.lon}
        />
      </div>
    </ApolloProvider>
  )
}

export default App;
