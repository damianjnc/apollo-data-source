import { ApolloServer, gql, IResolverObject } from 'apollo-server'
import fetch from 'node-fetch'
import { RandomUserDataSource } from './RandomUserDataSource'

const typeDefs = gql`
  type Person {
    gender: String
    email: String
    phone: String
  }

  type Query {
    randomPerson: [Person!]!
    randomPerson2: [Person!]!
  }
`

const resolvers: IResolverObject | any = {
  Query: {
    // standard way of doing it
    randomPerson: async () => {
      const response = await fetch('https://api.randomuser.me/')
      const data = await response.json()
      return data.results
    },
    // using datasources to achive better architecture and caching 
    randomPerson2: (_: any, __: any, { dataSources }: any) => {
      return dataSources.randomUserAPI.getPerson()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    randomUserAPI: new RandomUserDataSource()
  })
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
