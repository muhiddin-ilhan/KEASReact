import React, { Component } from 'react'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageConstant from '../../constant/page_constant'
import PageContent from '../../components/PageContent'
import PageContentHeader from '../../components/PageContentHeader'
import MaterialTable from 'material-table'
import { tableIcons, tableLocalization, tableOptions } from '../../config/material_table_config'
import { Assessment, Delete } from '@material-ui/icons'
import { Redirect } from 'react-router-dom'
import { HttpRequest } from '../../services/services'
import AppConstant from '../../constant/app_constant'
import { SwAlert, SwAlertToast } from '../../components/SweetAlert'
import Edit from '@material-ui/icons/Edit'

export default class UsersView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        this.state = {
            isLoading: true,
            redirect: "",
            users: [],
            clickedUser: {}
        }

        this.getAllUsers();
    }

    getAllUsers = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        let body = ""
        if (user.VendorId !== 1) {
            body = {
                "VendorId": user.VendorId
            }
        }

        const response = await HttpRequest(body, "/User/GetAllUser");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        this.setState({
            users: response
        })
    }

    goUserTaskView = (e, userInfo) => {
        this.setState({
            clickedUser: userInfo,
            redirect: PageConstant.USER_TASK_PAGE_URL
        })
    }

    goUserDetailView = (e, userInfo) => {
        this.setState({
            clickedUser: userInfo,
            redirect: PageConstant.USER_EDIT_PAGE_URL
        })
    }

    onDeleteUser = async (e, userInfo) => {
        const result = await SwAlert({ icon: "success", title: "Kullan??c??y?? Sil", text: "Kullan??c??y?? Silmek ??stedi??inizden Emin misiniz?" })
        if (result.isConfirmed) {
            this.setState({ isLoading: true });

            const data = {
                Id: userInfo.Id
            }

            const response = await HttpRequest(data, "/User/DeleteUser");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
                return;
            };

            if (response.IsSuccess) {
                SwAlertToast({ icon: "success", title: "Kullan??c?? Ba??ar??yla Silindi" });
            } else {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
            }

            this.setState({
                users: this.state.users.filter(item => item.Id != userInfo.Id)
            })
        }
    }

    render() {
        const { isLoading, redirect, users, clickedUser } = this.state;

        if (redirect === PageConstant.USER_TASK_PAGE_URL) {
            return <Redirect to={{ pathname: PageConstant.USER_TASK_PAGE_URL, state: { user: clickedUser } }} push={true} />;
        } else if (redirect === PageConstant.USER_EDIT_PAGE_URL) {
            return <Redirect to={{ pathname: PageConstant.USER_EDIT_PAGE_URL, state: { user: clickedUser } }} push={true} />;
        }

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.USERS_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">Kullan??c??lar</h1>
                    </PageContentHeader>

                    <PageContent>
                        <MaterialTable
                            isLoading={isLoading}
                            icons={tableIcons}
                            options={tableOptions}
                            localization={tableLocalization}
                            actions={[
                                // {
                                //     icon: Assessment,
                                //     tooltip: "G??revleri G??r",
                                //     onClick: this.goUserTaskView
                                // },
                                {
                                    icon: Delete,
                                    tooltip: "Kullan??c??y?? Sil",
                                    onClick: this.onDeleteUser
                                },
                                {
                                    icon: Edit,
                                    tooltip: "Detaylar?? G??r",
                                    onClick: this.goUserDetailView
                                }
                            ]}
                            columns={[
                                { title: "#", field: "Id" },
                                { title: "Ad", field: "Name" },
                                { title: "Soyad", field: "SurName" },
                                { title: "Telefon", field: "Phone" },
                                { title: "Rol", field: "Role.Title" },
                                { title: "Kime Ait", field: "Vendor.Title" },
                            ]}
                            data={users}
                            title={"Kullan??c?? Listesi"}
                        />
                    </PageContent>
                </div>
            </div>
        )
    }
}
