import React from 'react'
import {Link, useLocation} from 'react-router-dom'

// Rest api clent instance (axios based)
import restApiClient from '../restapi.js'


const users = [
    {
        "id": 1,
        "username": "admin",
        "first_name": "John",
        "last_name": "Doe",
        "email": "admin@gmail.com"
    },
    {
        "id": 2,
        "username": "luke",
        "first_name": "Luke",
        "last_name": "Skywalker",
        "email": "lukeskywalker@gmail.com"
    },
    {
        "id": 3,
        "username": "R2D2",
        "first_name": "R2",
        "last_name": "D2",
        "email": "droid@gmail.com"
    }
]





const UserRow = ({user}) => {
  return (
    <tr key={user.id}>
      <td>
        {user.first_name}
      </td>
      <td>
        {user.last_name}
      </td>
      <td>
        {user.birthday_year}
      </td>
      </tr>
  )
}



class UserList extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      'data': [],
      'title': 'Users List',
    }
    this.update = this.update.bind(this);  
  }

  componentDidMount() {
    this.setState({'data': users})
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log(nextProps);
    //console.log(nextState);
    //console.log(this.state)
    
    //if (nextState != this.state) {
    //  console.log(nextState);
    //  console.log(this.state)
    //  console.log('>>>true')
    //  return true;
    //}

    return true;
  }




  update() {
    

    //console.log('update')
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
        <Link to={{}} onClick={() => this.update()} >
          Update
        </Link>
        <table className="data-table">
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
       </table>
      </div>
    )
  }
}

export default UserList

