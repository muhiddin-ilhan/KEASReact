import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PageConstant from "../constant/page_constant";

export default class Header extends Component {
  state = {
    redirect: ""
  }

  logout = () => {
    this.setState({
      redirect: PageConstant.LOGIN_PAGE_URL
    })
  };

  render() {
    const { redirect } = this.state;

    if (redirect === PageConstant.LOGIN_PAGE_URL) {
      return <Redirect to={PageConstant.LOGIN_PAGE_URL} push={true} />;
    }

    return (
      <nav className="main-header navbar navbar-expand navbar-black navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="/#" role="button">
              <i className="fas fa-bars" />
            </a>
          </li>
          <li className="nav-item">
            <h5 className="nav-link"></h5>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item" onClick={this.logout}>
            <a className="nav-link" data-widget="control-sidebar" data-slide="true" role="button">
              <h5>
                <span style={{ marginRight: 5 }}>Çıkış Yap </span>
                <i className="fas fa-sign-out-alt" />
              </h5>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
