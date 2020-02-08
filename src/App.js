import React from 'react';
import './App.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';

Moment.globalFormat = 'HH:mm';

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
})

const kumpula_coordinates = {
  lat: 60.2051,
  lon: 24.9623
}

const eficode_coordinates = {
  lat: 60.169433,
  lon: 24.925835
}

const PLAN_QUERY = gql`
  {
    plan(
      from: {lat: ${kumpula_coordinates.lat}, lon: ${kumpula_coordinates.lon}}
      to: {lat: ${eficode_coordinates.lat}, lon: ${eficode_coordinates.lon}}
      numItineraries: 6
    ) {
      itineraries {
        startTime
        legs {
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

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <p>Kumpula - Eficode HQ</p>

        <ul>
          <Query query={PLAN_QUERY}>
            {({ loading, data }) => {
              if (loading) return 'Loading...'
              const itineraries = data.plan.itineraries
              return (
                <div>
                  {itineraries.map(i => 
                    <div>
                      <h3>Start time: <Moment unix>{i.startTime}</Moment></h3>
                      <ul>
                        {i.legs.map(l => 
                          <li>{l.mode} {l.from.name} - {l.to.name}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )
            }}
          </Query>
        </ul>
      </div>
    </ApolloProvider>
  );
}

export default App;
