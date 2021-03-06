import React, { Component } from 'react'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageConstant from '../../constant/page_constant'
import PageContent from '../../components/PageContent'
import PageContentHeader from '../../components/PageContentHeader'
import MaterialTable from 'material-table'
import { tableIcons, tableLocalization, tableOptions } from '../../config/material_table_config'
import { Assessment, Assignment, Delete } from '@material-ui/icons'
import { Redirect } from 'react-router-dom'
import { HttpRequest } from '../../services/services'
import AppConstant from '../../constant/app_constant'
import { SwAlert, SwAlertToast } from '../../components/SweetAlert'
import Edit from '@material-ui/icons/Edit'

export default class AssignedTaskView extends Component {
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
            filterTasks: [],
            clickedTask: {},
            isFilter: "all"
        }

        this.getAllTasks();
    }

    getAllTasks = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        let body = ""
        if (user.VendorId !== 1) {
            body = {
                "Task": {
                    "VendorId": user.VendorId
                }
            }
        }

        let response = await HttpRequest(body, "/TaskTruckUserRelation/GetAllTasks");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        response.map(task => {
            task.EntryDate = this.dateToString(new Date(task.EntryDate))
            task.DischargeDate = this.dateDifference(new Date(task.DischargeDate)) > 1000000 ? "Bekleniyor" : this.dateToString(new Date(task.DischargeDate))
        })

        this.setState({
            tasks: response,
            filterTasks: response
        })
    }

    goTaskDetailPage = (e, taskInfo) => {
        this.setState({
            clickedTask: taskInfo,
            redirect: PageConstant.ASSIGNED_TASK_DETAIL_PAGE_URL
        })
    }

    onDeleteTask = async (e, taskInfo) => {
        const result = await SwAlert({ icon: "success", title: "G??revi Sil", text: "G??revi Silmek ??stedi??inizden Emin misiniz?" })
        if (result.isConfirmed) {
            this.setState({ isLoading: true });

            const data = {
                Id: taskInfo.Id
            }

            const response = await HttpRequest(data, "/TaskTruckUserRelation/DeleteTaskRelation");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
                return;
            };

            if (response.IsSuccess) {
                SwAlertToast({ icon: "success", title: "G??revi Ba??ar??yla Silindi" });
            } else {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
            }

            this.setState({
                tasks: this.state.tasks.filter(item => item.Id != taskInfo.Id)
            })
        }
    }

    dateToString = (date) => {
        let day = new Date(date).getDate();
        let month = new Date(date).getMonth();
        let year = new Date(date).getFullYear();
        let hour = new Date(date).getHours();
        let minute = new Date(date).getMinutes()
        if (hour.length === 1) {
            hour = "0" + hour;
        }
        if (minute.length === 1) {
            minute = "0" + minute;
        }
        return day + "/" + month + "/" + year + " " + hour + ":" + minute;
    }

    dateDifference = (date) => {
        const time = new Date().getTime() - new Date(date).getTime();
        const minute = Math.floor(time / (1000 * 60));
        return minute;
    }

    filterTasks = (value) => {
        const { tasks } = this.state;

        this.setState({
            isFilter: value,
            filterTasks: tasks.filter(task => {
                if (value === "all") {
                    return true;
                } else if (value === "ok") {
                    if (task.DischargeDate !== "Bekleniyor") {
                        return true;
                    }
                } else {
                    if (task.DischargeDate === "Bekleniyor") {
                        return true;
                    }
                }
                return false;
            })
        })
    }

    render() {
        const { isLoading, redirect, tasks, clickedTask, isFilter, filterTasks } = this.state;

        if (redirect === PageConstant.ASSIGNED_TASK_DETAIL_PAGE_URL) {
            return <Redirect to={{ pathname: PageConstant.ASSIGNED_TASK_DETAIL_PAGE_URL, state: { task: clickedTask } }} push={true} />;
        }

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.ASSIGNED_TASK_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <span className="d-flex">
                            <h1 className="m-0 text-dark">Atanm???? G??rev Listesi</h1>
                            <button onClick={this.filterTasks.bind(this, "all")} className={"btn btn" + (isFilter !== "all" ? "-outline" : "") + "-info ml-2"}><i className="fas fa-align-justify"></i> T??m??</button>
                            <button onClick={this.filterTasks.bind(this, "ok")} className={"btn btn" + (isFilter !== "ok" ? "-outline" : "") + "-success ml-2"}><i className="fas fa-check"></i> Tamamlanm????</button>
                            <button onClick={this.filterTasks.bind(this, "not")} className={"btn btn" + (isFilter !== "not" ? "-outline" : "") + "-danger ml-2"}><i className="fas fa-times"></i> Bekleyen</button>
                        </span>
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
                                    icon: Assignment,
                                    tooltip: "Detaylar?? G??r",
                                    onClick: this.goTaskDetailPage
                                }
                            ]}
                            columns={[
                                { title: "#", field: "Id" },
                                { title: "G??rev Ad??", field: "Task.TaskTitle" },
                                { title: "Ara??", field: "Truck.Plaque" },
                                { title: "??of??r", field: "User.Name" },
                                { title: "Telefon", field: "User.Phone" },
                                { title: "G??rev Tarihi", field: "EntryDate" },
                                { title: "Bo??alt??m Tarihi", field: "DischargeDate" }
                            ]}
                            data={filterTasks}
                            title={"Atanm???? G??rev Listesi"}
                        />
                    </PageContent>
                </div>
            </div>
        )
    }
}
