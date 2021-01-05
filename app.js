var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Student {
    firstname: String!
    lastname: String!
    age: Int!
  }

  type Classroom {
    name: String!
    students: [Student!]!
  }

  type Query {
    classroom(name: String): Classroom
  }
`);

class Classroom {
  constructor(name, students) {
    this.name = name;
    this.students = students;
  }
}

class Student {
  constructor(firstname, lastname, birthyear) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.birthyear = birthyear;
  }
  age() {
    return new Date().getFullYear() - this.birthyear;
  }
}

// The root provides a resolver function for each API endpoint
var root = {
  classroom: ({name}) => {
    return new Classroom(name, [new Student("George", "Edouard", 1990), new Student("Charles", "Gustave", 1992)]);
  },
};

var app = express();

app.use(express.static('public'))

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(3000);

console.log('Running a GraphQL API server at http://localhost:3000/graphql');