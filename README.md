First project from [this Serverless React, GraphQL and AWS Amplify course](https://www.udemy.com/course/serverless-react-with-aws-amplify/) on Udemy.

This project is a note taker that allows a user to create, delete and edit notes using a React interface and GraphQL+AWS backend. You can read my introduction to GraphQL [here](https://seccl.tech/blog/introduction-graphql/).

### `yarn start`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

Steps for setup
* Install Amplify CLI, configure Amplify CLI with AWS Account
* Create React project with [Create React App](https://github.com/facebook/create-react-app)
* Initialise the Amplify inside project using Amplify CLI with `amplify init`
* Bring in GraphQL services (API + database)for making + persisting data with `amplify add api`, setup authentication
* Create schema by adding a GraphQL type in schema.graphql. Then provision resources and generate
all front-end config/boilerplate to interface with API using `amplify push`


Mutations vs Subscriptions:
* Section 6 deals with adding subscriptions to replace the logic for updating state based on the returned
data from mutations. I think that in this simple app the extra complexity and the fact that data to update
state in response to an acion (user creating a note) is spready in several places isn't worth the benefits,so I
only chose to implement this to createNote to compare to the deleteNote/updateNote approaches which dont use subscriptions
