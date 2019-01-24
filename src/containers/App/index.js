import React from 'react';
import Routes from '../routes';

import { getUser } from './actions';
import dataLoader, { LoaderFn } from '../../utils/dataLoader';
import { makeSelectUserLoaded } from './selectors';

import ResourceLoading from './ResourceLoading';
import Toolbar from '../Toolbar';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <ResourceLoading />
      <Toolbar />
      <Routes />
    </div>
  );
};

const loaders = [new LoaderFn('currentUser', getUser, makeSelectUserLoaded)];

const withData = dataLoader(loaders, { ignoreDidUpdate: true });

export default withData(App);
