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

export default class TaskView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        this.state = {
            isLoading: true,
            redirect: "",
            tasks: [],
            clickedTask: {}
        }

        this.getAllTasks();
    }

    getAllTasks = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        let body = ""
        if (user.VendorId !== 1) {
            body = {
                "VendorId": user.VendorId
            }
        }

        const response = await HttpRequest(body, "/Task/GetAllTasks");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        this.setState({
            tasks: response
        })
    }

    goTaskEditPage = (e, taskInfo) => {
        this.setState({
            clickedTask: taskInfo,
            redirect: PageConstant.TASK_EDIT_PAGE_URL
        })
    }

    onDeleteTask = async (e, taskInfo) => {
        const result = await SwAlert({ icon: "success", title: "G??revi Sil", text: "G??revi Silmek ??stedi??inizden Emin misiniz?" })
        if (result.isConfirmed) {
            this.setState({ isLoading: true });

            const data = {
                Id: taskInfo.Id
            }

            const response = await HttpRequest(data, "/Task/DeleteTask");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
                return;
            };

            if (response.IsSuccess) {
                SwAlertToast({ icon: "success", title: "Tedarik??i Ba??ar??yla Silindi" });
            } else {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
            }

            this.setState({
                tasks: this.state.tasks.filter(item => item.Id != taskInfo.Id)
            })
        }
    }

    render() {
        const { isLoading, redirect, tasks, clickedTask } = this.state;

        if (redirect === PageConstant.TASK_EDIT_PAGE_URL) {
            return <Redirect to={{ pathname: PageConstant.TASK_EDIT_PAGE_URL, state: { task: clickedTask } }} push={true} />;
        }

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.TASKS_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">G??rev Listesi</h1>
                    </PageContentHeader>

                    <PageContent>
                        <MaterialTable
                            isLoading={isLoading}
                            icons={tableIcons}
                            options={tableOptions}
                            localization={tableLocalization}
                            actions={[
                                {
                                    icon: Delete,
                                    tooltip: "G??revi Sil",
                                    onClick: this.onDeleteTask
                                },
                                {
                                    icon: Edit,
                                    tooltip: "G??ncelle",
                                    onClick: this.goTaskEditPage
                                }
                            ]}
                            columns={[
                                { title: "#", field: "Id" },
                                { title: "Ba??l??k", field: "TaskTitle" },
                                { title: "Kimin Ad??na", field: "ConsumerName" },
                                { title: "Kay??t Yapan", field: "RegistrantName" },
                                { title: "Teslimat Fabrikas??", field: "Factory.Title" },
                                { title: "Tedarik??i", field: "Vendor.Title" }
                            ]}
                            data={tasks}
                            title={"Tedarik??i Listesi"}
                        />
                    </PageContent>
                </div>
            </div>
        )
    }
}
