import React, { Component } from 'react';
import { connect } from 'react-redux';

import { authActions } from '../actions';
import DevTools from './DevTools';
import Header from '../components/Header';
import { Sidebar, SidebarItem } from '../components/Dashboard';

class App extends Component {
  render() {
    return (
      <div>
        <Header user={this.props.user} onLogout={this.props.logout} />
        <div className="container">
          <div className="row">
            <Sidebar>
              <SidebarItem title="Import" route="/import" icon="icon icon-budicon-375" />
              <SidebarItem title="Export" route="/export" icon="icon icon-budicon-322" />
            </Sidebar>
            <div id="content" className="wrapper col-xs-10">
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    user: {
    }
  };
}

export default connect(select, { ...authActions })(App);
