import React from 'react'


const authors = [
      {
      'first_name': 'Фёдор',
      'last_name': 'Достоевский',
      'birthday_year': 1821
      },
      {
      'first_name': 'Александр',
      'last_name': 'Грин',
      'birthday_year': 1880
      },
      ]
      


const TableRow = ({author}) => {
	
	return (
		<tr key={author.first_name}>
		  <td>
		    {author.first_name}
		  </td>
		  <td>
		    {author.last_name}
		  </td>
		  <td>
		    {author.birthday_year}
		  </td>
	    </tr>
	)
}


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


class AuthorsList extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      'data': [],
      'title': 'Authors list',
    }
  }

  // Use database query here
  componentDidMount() {
    console.log('>>>>>>>>>>>Authors>>>>>>>>>>>')
    this.setState({'data': authors})
    //this.setState({'title': 'Please tap Users or Clients to receive data'});
  }
  
  render() {
    const authors = this.state.data
    console.log(authors)
    return (
      <div>
       <h3><center>{this.state.title}</center></h3>
       <table className="data-table">
       <th>
         First name
       </th>
       <th>
         Last Name
       </th>
      <th>
        Birthday year
      </th>
     {authors.map((author) => <TableRow author={author} />)}
     </table>
     </div>
    )
  }
}



export default AuthorsList

