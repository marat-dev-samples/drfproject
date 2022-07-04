import React, { useState } from 'react'
import { Link, useLocation, useParams, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types';


import { Modal, Button, ButtonGroup, Table } from 'react-bootstrap';


// Rest api clent instance (axios based)
import restApiClient from  '../restapi.js'






/**
 * Use class for Project -> useState put in to the functional component <Button> 
 * + Project component must request self details by state.url
 * + Create ToDo component
 *   + Edit, change status of ToDo Note
 *   - Create new note, Project -> create Note -> redirect to board
 * Create Login component
 * + Create universal popup
 * Use filtering to api
 * restApiClient use redirects in restapi.js class
 *  - case unautentificated - redirect to login page
 *  - case no internet connection - show no connection popup
 * + restApiClient use react route to redirect pages ???
 * restApiClient cetup cookies and token for restapi

 * + change host in restapi.js to window.hostname
 * Ability to create new project
 * Delete existing project
 * Set drf user permissions
   + Board project name 
 */ 




/** 
 * This must be resolved from request
 */ 
const todo1 = [
    
    {
        "url": "http://127.0.0.1:8000/api/todo/1/",
        "project": 2,
        "customer": 1,
        "text": "Note append from John Doe",
        "created": "2022-05-17T07:16:00Z",
        "updated": "2022-05-29T14:24:45.487339Z",
        "status": "Active",
        "camelCaseField": "Updated value"
    },
    {
        "url": "http://127.0.0.1:8000/api/todo/8/",
        "project": 2,
        "customer": 2,
        "text": "I am new from Luke Skywalker note appended again",
        "created": "2022-05-28T19:56:16.266737Z",
        "updated": "2022-05-29T14:10:20.485456Z",
        "status": "Active",
        "camelCaseField": "values"
    }
]

// Comment

const colors = {
  'Normal': '#00c0d6', 
  'Urgent': '#fdfe46',
  'Delayed': '#e8e8e8' 
}
const statuses = ['Active', 'Progress', 'Done', 'Closed'];

function EditNoteModal(props) {

  const [show, setShow] = useState(false);
  const [note, setNote] = useState(props.note);
   
  const handleClose = () => {
    setShow(false); 
  };
  
  const handleSubmit = () => {
    setShow(false); 
    props.onSubmit(note)
  }

  const handleShow = () => setShow(true);

  const set = name => {
    return ({ target: { value } }) => {
      setNote(oldValues => ({...oldValues, [name]: value }));
    }
  };

  return (
    <>

      <Button size="sm" variant="primary" onClick={() => handleShow()}>
        Edit
      </Button>
      

      <Modal show={show} onHide={handleClose}>
        <div className="modal-header bg-primary">
          <h5 className="modal-title text-white" id="exampleModalLabel">
          Edit note of project: {note.project}
          </h5>
        </div>
        
        <Modal.Body>
          <label className="form-check-label">
            <b>Text</b>
          </label>
          
          <form>
            <textarea className="form-control" id="noteText" rows="4" value={note.text} onChange={set('text')} />
          </form>
         
          <br/>
          <label className="form-check-label">
            <b>Status</b>
          </label>
          <br/>
          &nbsp; 
          <ButtonGroup size="sm">
            { statuses.map((status, key) => {   
              let variant = status == note.status ? "warning" : "light";
              return <Button key={key} value={status} onClick={set('status')} variant={variant}>{status}</Button>
            })}
          </ButtonGroup>   

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function DelNoteModal(props) {

  const [show, setShow] = useState(false);
   
  const handleClose = () => {
    setShow(false); 
  };
  
  const handleSubmit = () => {
    setShow(false); 
    props.onSubmit()
  }

  const handleShow = () => setShow(true);

  return (
    <>
      <Button size="sm" variant="danger" onClick={() => handleShow()}>
        Del
      </Button>
      <Modal show={show} onHide={handleClose}>
        <div className="modal-header bg-primary">
          <h5 className="modal-title text-white" id="exampleModalLabel">
          Delete note
          </h5>
        </div>
        
        <Modal.Body>
          <label className="form-check-label">
            <b>Text</b>
          </label>
          <br/>
          
          <label className="form-check-label">
            <b>Do you really want to delete current note ?</b>
          </label>
          <br/>
          &nbsp; 
      </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

class Note extends React.Component {

  constructor(props) {
    super(props)
    
    this.state = {
      'status': this.props.note.status,
      'resource': this.props.note.url,
      'redirect': false
    }
    
    // Resolve from note object
    this.statusVariants = statuses
    this.colorsVariants = colors


    //this.update = this.update.bind(this);  
    //this.textUpdate = this.textUpdate.bind(this);                  
    this.noteUpdate = this.noteUpdate.bind(this);                  
    this.noteDelete = this.noteDelete.bind(this);                  
  
    //this.statusUpdate = this.statusUpdate.bind(this);    // Reload 
    //this.colorUpdate = this.colorUpdate.bind(this);
  }

  /**
   * Note status changing, utilize PATCH request
   * refresh parent component after update successfull
   */
  noteUpdate(data) {
    const payload = {status: data.status, text: data.text}
    restApiClient.patch(this.state.resource, payload).then(
      (response) => this.props.refresh()    
    ).catch(error => console.log('> Update error ' + error))
  
   //this.setState({'redirect': true})
  }

  /**
   * Note deleting action, utilize DELETE request
   * refresh parent component after update successfull
   */
  noteDelete() {
    //const payload = {status: data.status, text: data.text}
    restApiClient.del(this.state.resource).then(
      (response) => this.props.refresh()    
    ).catch(error => console.log('> Update error ' + error))
  
   //this.setState({'redirect': true})
  }


  render() {
    const note = this.props.note;
     
    // Conditional rendering for redirect  
    //if (this.state.redirect) {
    //  return <Navigate to="/projects" push={true} />;
    //}
     
    return (
        <div className="todo-box">
          <b>{note.projectStr}</b>
          <hr/>
          {note.text}
          <br/>
          
          <div className="todo-box-footer"> 
            <div> 
              <EditNoteModal note={note} onSubmit={(data)=>this.noteUpdate(data)} />   
            </div> 
            <div>
            <DelNoteModal note={note} onSubmit={()=>this.noteDelete()} />   
              </div>
            </div>
        </div>
    )
  } 
}

class ToDoBoard extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      'data': [],
      'title': 'Canban board',
    }
    this.update = this.update.bind(this);  
  }

  componentDidMount() {
    console.log('> Component mounted')
    this.update()
    return



    //this.setState({'data': projects.results})
  }


  //shouldComponentUpdate(nextProps, nextState) {
  //  return true;
  //}





  update() {
    console.log('[>] Update')
    restApiClient.get(this.props.resource).then(
      (response) => this.setState({'data': response.data})
    ).catch(error => console.log('> Update error ' + error))
  } 


  render() {
    const notes = this.state.data
    const columns = ['Active', 'Progress', 'Done'];
    return (
      <div>
        <br/>
        <h3><center>{this.state.title}</center></h3>
        <hr/>
        <table className="data-table">
          <thead>
            <tr>
            {columns.map((status, key) => <th key={key} ><h5>{status}</h5></th>)}
            </tr>      
          </thead>
          <tbody>
            {notes.map((note, i) => {
              return (
                <tr key={i}>
                  {columns.map((status, key) =>  
                    <td key={key} >
                      {note.status == status ? <Note note={note} refresh={()=>this.update()} /> : <EmptyCell />} 
                    </td>
                  )}
                </tr>
              )
            })}
        </tbody>
        </table>
        <Link to={{}} onClick={() => this.update()} >
          Update
        </Link>
      </div>
    )
  }
}

const EmptyCell = () => {
  return (
    <div className="todo-box empty">&nbsp;</div>
  )
}






















// A custom hook that builds on useLocation to parse
// the query string for you.
//function useQuery() {
//  const search = useLocation();
//  //return React.useMemo(() => new URLSearchParams(search), [search]);
//  
//  return new URLSearchParams(search);
    

//}



/**
 * Class approach with corresponding Wrapper to access url params
 * and pass state via v6 Route
*/

/*
class Project extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      'data': [],
      'title': 'Project info',
    }
    this.update = this.update.bind(this);  
  }

  componentDidMount() {
    this.setState({'data': project})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  update(resource='', title='') {
    console.log('update')
    resource = 'customers'

    // Move all queries to separate class
    axios.get('http://127.0.0.1:8000/api/' + resource)
      .then(response => {
      console.log(response)
      
      const data = response.data
      this.setState({'data': data, 'title': title})
    
    }).catch(error => console.log(error))
  } 

  render() {
    const project = this.state.data
    console.log('>>>>>>>>>>>>>>>>>>')
    console.log(this.props)

    return (
      <div>
        <h3><center>{this.state.title}</center></h3>
        <Link to={{}} onClick={() => this.update()} >
          Update
        </Link>
        
        <ul>
          <li>
            <span>Project name: {project.projectName}</span>
          </li>
          <li>
            <span>Users: {project.users}</span>
          </li>
          <li>
          </li>

        </ul>
      </div>
    )
  }
}

const Wrapper = (props) => {
  const params = useParams();
  //const location = useLocation();
  return <Project {...{...props, match: {params}, location: {location}} }/> 
}

export {ProjectList, Project, Wrapper}
*/



const Project = () => {
  const location = useLocation();
  
  //const state = useState();

  //console.log(state)
  console.log(location.state)

  
  

  //console.log(this.props)
  //console.log(this.props.match)

  //const navigate = useNavigate();
  //const match = useMatch("write-the-url-you-want-to-match-here");

  //return (
  //  <div>{location.pathname}</div>
  //)

  const project = {}; //project

  return (
    <div>
      <h3><center>Project</center></h3>
      <ul>
        <li>
          <span>Project name: {project.projectName}</span>
        </li>
        <li>
          <span>Users: {project.users}</span>
        </li>
        <li>
          <span>Project info url: {location.state.url}</span>
        

        </li>

      </ul>
    </div>
  )
}

export {ToDoBoard}

