import React from 'react';
import { HashRouter, Route, Link, Routes, useLocation } from 'react-router-dom'
import axios from 'axios'

import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


import UserList from './components/UserList.js'
import { ProjectList, Project } from './components/ProjectList.js'
import Login from './components/Login.js'


import {ToDoBoard} from './components/ToDoBoard.js'


// Rest api clent instance (axios based)
import restApiClient from './restapi.js'


//import Project from './components/ProjectList.js'


import AppMenu from './components/Menu.js'
import AppFooter from './components/Footer.js'


function NotFound404() {
  const location = useLocation();
  console.log('i am NotFound')
  return (
    <div>
      <h1>Страница не найдена 404 {location.pathname}</h1>
    </div>
  )
}

function About() {
  return (
    <div>
      <center>
      <br/>
      <h3>About</h3>
      <h5>
        This is a testing project to discover opportunities of <br/>React + DjangoRestFramework bundle
      </h5>
      <br/>
      To test all features please use following credentials
      <br/>
      Username: luke
      <br/>
      Password: luke
      </center>
    </div>


  )
}

const AppRoutes = (props) => (
  <Routes>
    <Route exact path='/' element={<About />} />
    <Route exact path='/users' element={<UserList />} />
    <Route exact path='/projects' element={<ProjectList />} />
    <Route exact path='/project/:id' element={<Project />} />
    <Route exact path='/board' element={<ToDoBoard resource='todo'/>} />
    <Route exact path='/login' element={<Login user={props.user} update={props.update} />} />
    <Route path='*' element={<NotFound404 />} />
  </Routes>
);

/**
 * Appends custom scripts to React application 
 */
export const appendScript = (scriptToAppend) => {
    alert('Append script')
    const script = document.createElement("script");
    script.src = scriptToAppend;
    script.async = true;
    document.body.appendChild(script);
}


/**
 * Main 
 */
export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      'data': [],          // Deprecate
      'title': '',         // Deprecate
      'user': null,
    }
   
    this.update = this.update.bind(this);  
    
    //this.clearList = this.clearList.bind(this);  
  }

  componentDidMount() {
    // An entry point to attach external libs
    //appendScript('/scripts/custom.js');     
    //this.user = this.getData()
    console.log('>>> Mount')
    
    restApiClient.currentUser().then((user) => { 
       console.log(user)
       this.setState({'user': user})
    });
    
    //console.log(user)
    //this.user = user
  }


  /**
   * This method may be passed as props to child component
   * and used to update parent component state from child action (login as example)
  */
  update(key, value) {
    this.setState({user: value})
  }

  render() {
    console.log('> Parent render')
    console.log(this.user)
    return (
        <HashRouter>
          <AppMenu user={this.state.user} />
          <AppRoutes user={this.state.user} update={(key, value) => this.update(key, value)} />
          <AppFooter />   
        </HashRouter>
    )
  }
}

// <Routes>
// <Route exact path='/' component={ ()=> <UserList authors={this.state.data} users={this.state.data} title={this.state.title}/>} />
//</Routes>  


















