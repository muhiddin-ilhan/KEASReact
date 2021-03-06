import { isEmptyObject } from "jquery";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppConstant from "../constant/app_constant";
import PageConstant from "../constant/page_constant";

export default class Menu extends Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem("user") === null || localStorage.getItem("user") === undefined) {
      window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
      return;
    } else {
      const roleCode = JSON.parse(localStorage.getItem("user"))
      this.state = {
        roleCode: roleCode.Role.RoleCode
      }
    }
  }

  render() {
    const { roleCode } = this.state;
    const { pageName } = this.props;
    return (
      <aside style={{ position: "fixed" }} className="main-sidebar sidebar-dark-teal elevation-4">
        <div>
          <Link to={PageConstant.MAIN_PAGE_URL}>
            <div style={{ cursor: "pointer" }} className="brand-link">
              <span className="brand-text font-weight-bold ml-2">KEAS</span>
            </div>
          </Link>
          <div className="sidebar">
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                {
                  roleCode !== 3 &&
                  <li className="nav-item has-treeview">
                    <Link to={PageConstant.MAIN_PAGE_URL}>
                      <a style={{ cursor: "pointer" }} className={pageName === PageConstant.MAIN_PAGE_URL ? "nav-link active" : "nav-link"}>
                        <i className="nav-icon fas fa-home"></i>
                        <p>Ana Sayfa</p>
                      </a>
                    </Link>
                  </li>
                }
                {
                  roleCode !== 3 &&
                  <>
                    <li className={pageName === PageConstant.USERS_PAGE_URL || pageName === PageConstant.USER_EDIT_PAGE_URL || pageName === PageConstant.USER_ADD_PAGE_URL ? "nav-item has-treeview menu-open" : "nav-item has-treeview"}>
                      <a style={{ cursor: "pointer" }} className="nav-link">
                        <i className="nav-icon fas fa-users" />
                        <p>
                          Kullan??c??lar
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <Link to={PageConstant.USERS_PAGE_URL}>
                            <a style={{ cursor: "pointer" }} className={pageName === PageConstant.USERS_PAGE_URL ? "nav-link active" : "nav-link"}>
                              <i className="far fa-circle nav-icon" />
                              <p>Kullan??c?? Listesi</p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <Link to={PageConstant.USER_ADD_PAGE_URL}>
                            <a style={{ cursor: "pointer" }} className={pageName === PageConstant.USER_ADD_PAGE_URL ? "nav-link active" : "nav-link"}>
                              <i className="far fa-circle nav-icon" />
                              <p>Kullan??c?? Ekle</p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className={pageName === PageConstant.TRUCKS_PAGE_URL || pageName === PageConstant.TRUCKS_EDIT_PAGE_URL || pageName === PageConstant.TRUCKS_ADD_PAGE_URL ? "nav-item has-treeview menu-open" : "nav-item has-treeview"}>
                      <a style={{ cursor: "pointer" }} className="nav-link">
                        <i className="nav-icon fas fa-car" />
                        <p>
                          Ara??lar
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <Link to={PageConstant.TRUCKS_PAGE_URL}>
                            <a style={{ cursor: "pointer" }} className={pageName === PageConstant.TRUCKS_PAGE_URL ? "nav-link active" : "nav-link"}>
                              <i className="far fa-circle nav-icon" />
                              <p>Ara?? Listesi</p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <Link to={PageConstant.TRUCKS_ADD_PAGE_URL}>
                            <a style={{ cursor: "pointer" }} className={pageName === PageConstant.TRUCKS_ADD_PAGE_URL ? "nav-link active" : "nav-link"}>
                              <i className="far fa-circle nav-icon" />
                              <p>Ara?? Ekle</p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    {
                      roleCode !== 4 &&
                      <>
                        <li className={pageName === PageConstant.VENDOR_PAGE_URL || pageName === PageConstant.VENDOR_ADD_PAGE_URL || pageName === PageConstant.VENDOR_EDIT_PAGE_URL ? "nav-item has-treeview menu-open" : "nav-item has-treeview"}>
                          <a style={{ cursor: "pointer" }} className="nav-link">
                            <i className="nav-icon fas fa-address-book" />
                            <p>
                              Tedarik??i
                              <i className="right fas fa-angle-left" />
                            </p>
                          </a>
                          <ul className="nav nav-treeview">
                            <li className="nav-item">
                              <Link to={PageConstant.VENDOR_PAGE_URL}>
                                <a style={{ cursor: "pointer" }} className={pageName === PageConstant.VENDOR_PAGE_URL ? "nav-link active" : "nav-link"}>
                                  <i className="far fa-circle nav-icon" />
                                  <p>Tedarik??i Listesi</p>
                                </a>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview">
                            <li className="nav-item">
                              <Link to={PageConstant.VENDOR_ADD_PAGE_URL}>
                                <a style={{ cursor: "pointer" }} className={pageName === PageConstant.VENDOR_ADD_PAGE_URL ? "nav-link active" : "nav-link"}>
                                  <i className="far fa-circle nav-icon" />
                                  <p>Tedarik??i Ekle</p>
                                </a>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className={pageName === PageConstant.FACTORIES_PAGE_URL || pageName === PageConstant.FACTORY_ENTRY_V??EW || pageName === PageConstant.FACTORY_TASK_V??EW || pageName === PageConstant.FACTORY_ADD_PAGE_URL || pageName === PageConstant.FACTORY_EDIT_PAGE_URL ? "nav-item has-treeview menu-open" : "nav-item has-treeview"}>
                          <a style={{ cursor: "pointer" }} className="nav-link">
                            <i className="nav-icon fas fa-industry" />
                            <p>
                              Fabrika
                              <i className="right fas fa-angle-left" />
                            </p>
                          </a>
                          <ul className="nav nav-treeview">
                            <li className="nav-item">
                              <Link to={PageConstant.FACTORIES_PAGE_URL}>
                                <a style={{ cursor: "pointer" }} className={pageName === PageConstant.FACTORIES_PAGE_URL ? "nav-link active" : "nav-link"}>
                                  <i className="far fa-circle nav-icon" />
                                  <p>Fabrika Listesi</p>
                                </a>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview">
                            <li className="nav-item">
                              <Link to={PageConstant.FACTORY_ADD_PAGE_URL}>
                                <a style={{ cursor: "pointer" }} className={pageName === PageConstant.FACTORY_ADD_PAGE_URL ? "nav-link active" : "nav-link"}>
                                  <i className="far fa-circle nav-icon" />
                                  <p>Fabrika Ekle</p>
                                </a>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className={pageName === PageConstant.DANGER_AREA_ADD_VIEW || pageName === PageConstant.DANGER_AREAS_VIEW ? "nav-item has-treeview menu-open" : "nav-item has-treeview"}>
                          <a style={{ cursor: "pointer" }} className="nav-link">
                            <i className="nav-icon fas fa-draw-polygon" />
                            <p>
                              B??lgeler
                              <i className="right fas fa-angle-left" />
                            </p>
                          </a>
                          <ul className="nav nav-treeview">
                            <li className="nav-item">
                              <Link to={PageConstant.DANGER_AREAS_VIEW}>
                                <a style={{ cursor: "pointer" }} className={pageName === PageConstant.DANGER_AREAS_VIEW ? "nav-link active" : "nav-link"}>
                                  <i className="far fa-circle nav-icon" />
                                  <p>Tehlikeli B??lge Listesi</p>
                                </a>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview">
                            <li className="nav-item">
                              <Link to={PageConstant.DANGER_AREA_ADD_VIEW}>
                                <a style={{ cursor: "pointer" }} className={pageName === PageConstant.DANGER_AREA_ADD_VIEW ? "nav-link active" : "nav-link"}>
                                  <i className="far fa-circle nav-icon" />
                                  <p>Tehlikeli B??lge Ekle</p>
                                </a>
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </>
                    }

                    <li className={pageName === PageConstant.TASKS_PAGE_URL || pageName === PageConstant.ASSIGNED_TASK_DETAIL_PAGE_URL || pageName === PageConstant.ASSIGNED_TASK_PAGE_URL || pageName === PageConstant.TASK_ASSIGN_PAGE_URL || pageName === PageConstant.TASK_ADD_PAGE_URL || pageName === PageConstant.TASK_EDIT_PAGE_URL ? "nav-item has-treeview menu-open" : "nav-item has-treeview"}>
                      <a style={{ cursor: "pointer" }} className="nav-link">
                        <i className="nav-icon fas fa-address-card" />
                        <p>
                          G??rev
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <Link to={PageConstant.TASKS_PAGE_URL}>
                            <a style={{ cursor: "pointer" }} className={pageName === PageConstant.TASKS_PAGE_URL ? "nav-link active" : "nav-link"}>
                              <i className="far fa-circle nav-icon" />
                              <p>G??rev Listesi</p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <Link to={PageConstant.TASK_ASSIGN_PAGE_URL}>
                            <a style={{ cursor: "pointer" }} className={pageName === PageConstant.TASK_ASSIGN_PAGE_URL ? "nav-link active" : "nav-link"}>
                              <i className="far fa-circle nav-icon" />
                              <p>G??rev Atamas??</p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <Link to={PageConstant.ASSIGNED_TASK_PAGE_URL}>
                            <a style={{ cursor: "pointer" }} className={pageName === PageConstant.ASSIGNED_TASK_PAGE_URL ? "nav-link active" : "nav-link"}>
                              <i className="far fa-circle nav-icon" />
                              <p>Atanm???? G??revler</p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview">
                        <li className="nav-item">
                          <Link to={PageConstant.TASK_ADD_PAGE_URL}>
                            <a style={{ cursor: "pointer" }} className={pageName === PageConstant.TASK_ADD_PAGE_URL ? "nav-link active" : "nav-link"}>
                              <i className="far fa-circle nav-icon" />
                              <p>G??rev Ekle</p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                }


                <li className="nav-item mt-3">
                  <a href="https://mobil.basarsoft.com.tr/Dev/KEASWebApiV2/app/keas.apk" className="nav-link" style={{ cursor: "pointer" }}>
                    <i className="nav-icon fas fa-download" />
                    <p>
                      Uygulamay?? ??ndir
                    </p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="https://mobil.basarsoft.com.tr/media/Keas/mobil.mp4" target="_blank" className="nav-link" style={{ cursor: "pointer", display: "table-cell" }}>
                    <i className="nav-icon fas fa-video" />
                    <p>
                      Mobil App Kullan??m??
                    </p>
                  </a>
                </li>
                {/*<li className="nav-item">
                  <a href="https://mobil.basarsoft.com.tr/media/Keas/KEASmobil.mp4" className="nav-link" target="_blank" style={{ cursor: "pointer", display: "table-cell" }}>
                    <i className="nav-icon fas fa-video" />
                    <p>
                      Mobil Kullan??m??
                    </p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="https://mobil.basarsoft.com.tr/media/Keas/KEASmobilsetup.mp4" className="nav-link" target="_blank" style={{ cursor: "pointer", display: "table-cell" }}>
                    <i className="nav-icon fas fa-video" />
                    <p>
                      Mobil App Kurulumu
                    </p>
                  </a>
                </li> */}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    );
  }
}
