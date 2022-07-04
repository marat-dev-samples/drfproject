import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Table, Modal, Button, ButtonGroup, } from 'react-bootstrap';

// Rest api clent instance (axios based)
import restApiClient from '../restapi.js'

const ProjectRow = ({project}) => {
  
  const location = useLocation();
  //console.log('Location')
  //console.log(location)

  //const projectPath = "/project/p"; //+ this.state.projectName 
  //const search = ":id=" + project.url
  const value = 'abc'

  return (
    <tr>
      <td>
        {project.projectName}
      </td>
      <td>
        <a href={project.repoLink} target="out">{project.repoLink}</a>
      </td>
      <td>
      <Link
        to={`/project/info`}
        state={{from: value, url: project.url, project: project}}
      >
        View
      </Link>
      </td>
    </tr>
  )
}

class ProjectList extends React.Component {
  
  constructor(props) {
    super(props)
    this.resource = 'projects/'
    this.state = {
      'data': [],
      'title': 'List of projects',
      'redirect': false,
    }
    this.update = this.update.bind(this);  
    this.newProjectRequest = this.newProjectRequest.bind(this);  
   
    this.delProject = this.delProject.bind(this);  
     
  }

  componentDidMount() {
    console.log('> Component mounted')
    this.update()
    return
    //this.setState({'data': projects.results})
  }

  shouldComponentUpdate(nextProps, nextState) {
    //if (nextState != this.state) {
    //  return true;
    //}
    return true;
  }

  update() {
    restApiClient.get(this.resource).then(
      (response) => this.setState({'data': response.data.results})
    ).catch(error => console.log('> Update error ' + error))
  } 

  newProjectRequest(data) {
    console.log('New project')
    restApiClient.post(this.resource, data).then( (response) => {
      this.update();
      //this.setState({'data': response.data.results})
    }).catch(error => console.log('> Create error ' + error))
  }
  
  delProject() {
    console.log('> Delete project request')
  }


  render() {
    const projects = this.state.data
 
    return (
      <div>
        <br/>
        <h3><center>{this.state.title}</center></h3>
        <Table striped bordered hover className="data-table">
         <thead>
         <tr>
           <th>
             Project Name
           </th>
           <th>
             Repo link
           </th>
          <th>
            Url link
          </th>
        </tr>
        </thead>
        <tbody>
         {projects.map((project, i) => <ProjectRow project={project} key={i} />)}
       </tbody>
       </Table>
       <div>
        <AddProjectModal onSubmit={(data) => this.newProjectRequest(data)}/>   
       </div>   
          {this.state.redirect && <Navigate to='/board' replace={true}/>}
      </div>
    )
  }
}

function AddProjectModal(props) {
  
  const newProject = {
    users: [],
    projectName: '', 
    repoLink: 'https://github.com/canbanrepo/'
  }

  const [show, setShow] = useState(false);
  const [project, setProject] = useState(newProject);

  const handleClose = () => {
    setShow(false); 
  };

  const handleSubmit = () => {
    setShow(false); 
    console.log(project)
    props.onSubmit(project)
    setProject(newProject)
  }

  const handleShow = () => setShow(true);

  const set = name => {
    return ({ target: { value } }) => {
      setProject(oldValues => ({...oldValues, [name]: value }));
    }
  };

  return (
    <>
      <center>
      <Button size="sm" variant="primary" onClick={() => handleShow()}>
        New Project
      </Button>
      </center>
      <Modal show={show} onHide={handleClose}>
        <div className="modal-header bg-primary">
          <h5 className="modal-title text-white" id="exampleModalLabel">
          New project
          </h5>
        </div>
        
        <Modal.Body>
         
          <form>
            <label className="form-label">New project name</label>
            <textarea 
              className="form-control" 
              id="noteText" 
              rows="4" 
              value={project.projectName} 
              onChange={set('projectName')} 
            />
            <label className="form-label">Repository link</label>
            <input 
              type="text" 
              className="form-control"
              value={project.repoLink} 
              onChange={set('repoLink')} 
            />
          </form>
         
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

function AddNoteModal(props) {
  /**
   * Get user id
   */ 
  const newNote = {
    project: props.project.projectId, 
    customer: 1, 
    text: '', 
    status: 'Active', 
    camel_case_field: null,
  }

  const [show, setShow] = useState(false);
  const [note, setNote] = useState(newNote);

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
      <center>
      <Button size="sm" variant="primary" onClick={() => handleShow()}>
        Project ToDo
      </Button>
      </center>
      <Modal show={show} onHide={handleClose}>
        <div className="modal-header bg-primary">
          <h5 className="modal-title text-white" id="exampleModalLabel">
          New note for project: {props.project.projectName}
          </h5>
        </div>
        
        <Modal.Body>
          <label className="form-check-label">
            <b>Text</b>
          </label>
          
          <form>
            <textarea className="form-control" id="noteText" rows="4" value={note.text} onChange={set('text')} />
          </form>
         
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

function SubmitModal(props) {

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
        {props.buttonText ? props.buttonText : 'Button'}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <div className="modal-header bg-primary">
          <h5 className="modal-title text-white" id="exampleModalLabel">
            Please submit action
          </h5>
        </div>
        
        <Modal.Body>
          <br/>
          <label className="form-check-label">
            {props.dialog ? props.dialog : 'Use props.dialog to set this title'}
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

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state.project;
  const [notes, setNotes] = useState([]);

  const getNotes = async () => {
      const query = 'query {project(id:'+ location.state.project.projectId + ') {notes {text, status}}}';
      restApiClient.post('graphql/', {query: query, variables: null}).then(
          (response) => {
            const notes = response.data.data.project[0].notes;
            //console.log(notes)
            setNotes(notes)
            return notes;
        }).catch(error => console.log('> GraphQl error ' + error))
  }

  function getNew(note='') {
    restApiClient.post('/todo/', note).then(
      (response) => navigate('/board/')
    ).catch(error => console.log('> Note error ' + error))
  }
  
  function delProject(id='') {
    restApiClient.del('/projects/' + id + '/').then(
      (response) => navigate('/projects/')
    ).catch(error => console.log('> Delete error ' + error))
  }
  

  useEffect(() => {
    getNotes();
  }, []);  

  return (
    <div>
      <br/>
      <h3><center>Project</center></h3>
      <h5>Project info</h5>
      <ul>
        <li>
          <span>Project name: {project.projectName}</span>
        </li>
        <li>
          <span>Users: {project.users}</span>
        </li>
        <li>
          <span>Project resource url: {location.state.url}</span>
        </li>

      </ul>
        <SubmitModal 
          buttonText="Delete project"
          dialog="Do you really want to delete project?"
          onSubmit={() => delProject(project.projectId)} 
        />
      <div>
        <AddNoteModal project={project} onSubmit={(note) => getNew(note)} />   
      </div>   
      <br/>
      <hr></hr>
      <h5>Project active notes (received via GraphQl request)</h5>
      <ul>
        {notes.map((item, key) => (<li><span key={key}> {item.status}: {item.text}</span></li>))}
      </ul>
    </div>
  )
}

export {ProjectList, Project}

