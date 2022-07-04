import React, { useState, useEffect } from 'react'
import { Route, Link, Routes, useNavigate, useLocation, useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import restApiClient from '../restapi.js'
import logo from '../logo.svg';

const AppMenu = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = props.user;
  return (
      <div>
        <div id="header" className="App-header">
          <div className = "flex-box">
            <img src={require('../images/personal_kanban.png')}/>
          </div>
          <div className="flex-box">
            <div id="tools">
              <nav>
                <ul>
                  <li>
                    <Link to='/'>Main</Link>
                  </li>
                  <li>
                    <Link to='/users'>Customers</Link>
                  </li>
                  <li>
                    <Link to='/projects'>Projects</Link>
                  </li>
                  <li>
                    <Link to='/board'>Board</Link>
                  </li>
                  <li>
                  </li>
                  <li>
                    <Button size="sm" 
                            variant="primary" 
                            onClick={() => navigate('/login')}>
                      {props.user?.isActive  ? 'Sign out' : 'Sign in'}
                    </Button>
                  </li>
                </ul>  
              </nav>
            </div>              
          </div>
        </div>
      </div>
    )
  }

export default AppMenu