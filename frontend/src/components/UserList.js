import React from 'react'
import {Link, useLocation} from 'react-router-dom'
import { Table, Button } from 'react-bootstrap';

// Rest api clent instance (axios based)
import restApiClient from '../restapi.js'


const users = [
    {
        "id": 1,
        "username": "admin",
        "firstName": "John",
        "lastName": "Doe",
        "email": "admin@gmail.com"
    },
    {
        "id": 2,
        "username": "luke",
        "firstName": "Luke",
        "lastName": "Skywalker",
        "email": "lukeskywalker@gmail.com"
    },
    {
        "id": 3,
        "username": "R2D2",
        "firstName": "R2",
        "lastName": "D2",
        "email": "droid@gmail.com"
    }
]





const UserRow = ({user}) => {
  return (
    <tr key={user.id}>
      <td>
        {user.firstName}
      </td>
      <td>
        {user.lastName}
      </td>
      <td>
        {user.birthdayYear}
      </td>
      </tr>
  )
}



class UserList extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      'data': [],
      'title': 'Customers',
    }
    this.update = this.update.bind(this);  
  }

  componentDidMount() {
    this.update();  
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  update() {
    //return
    console.log('update')
    const resource = 'customers'
    restApiClient.get(resource).then(
      (response) => this.setState({'data': response.data.results})
    ).catch(error => console.log('> Update error ' + error))
    return
  } 

  render() {
    const users = this.state.data
    return (
      <div>
        <h3><center>{this.state.title}</center></h3>
        <Table striped bordered hover className="data-table">
         <thead>
         <tr>
           <th>
            First name
           </th>
           <th>
            Last Name
           </th>
          <th>
            Birthday year
          </th>
        </tr>
        </thead>
        <tbody>
         {users.map((user, i) => <UserRow user={user} key={i} />)}
       </tbody>
       </Table>
       <center>
        <Button size="sm" variant="primary" onClick={() => this.update()} >
          Update
        </Button>
       </center> 
      </div>
    )
  }
}

export default UserList

