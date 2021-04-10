import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Layout } from 'antd';

import rootReducer from './reducers';
import { fetchAllData } from './actions/saga';
import SideMenu from './components/SideMenu/SideMenu';
import HeaderMenu from './components/HeaderMenu/HeaderMenu';
import SearchRepositories from './components/SearchRepositories/SearchRepositories';
import Report from './components/Report/Report';

const { Footer, Content } = Layout;

const App = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(fetchAllData);

  return (
    <Provider store={store}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <SideMenu />

          <Layout className="site-layout">
            <HeaderMenu />
            {/* <Header style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Github finder</Header> */}

            <Content style={{ margin: '0 16px' }}>
              <Route exact path="/" component={SearchRepositories} />
              <Route path="/report" component={Report} />
            </Content>

            <Footer style={{ textAlign: 'center' }}>Github finder ©2021 Created by Andrew Khaw</Footer>
          </Layout>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;