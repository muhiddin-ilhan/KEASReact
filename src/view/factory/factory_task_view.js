import { Assignment, Delete } from '@material-ui/icons';
import MaterialTable from 'material-table';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageContent from '../../components/PageContent';
import { SwAlert, SwAlertToast } from '../../components/SweetAlert';
import { tableIcons, tableLocalization, tableOptions } from '../../config/material_table_config';
import AppConstant from '../../constant/app_constant';
import PageConstant from '../../constant/page_constant'
import { HttpRequest } from '../../services/services';

export default class FactoryTaskView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        const factory = props.location.state.factory
        this.state = {
            isLoading: true,
            factory: factory,
            filterTasks: [],
            tasks: [],
            redirect: "",
            clickedTask: {}
        }

        this.getTasksByFactoryId(factory.Id);
    }

    getTasksByFactoryId = async (factoryId) => {
        const body = {
            "Task": {
                "FactoryId": factoryId
            }
        }

        let response = await HttpRequest(body, "/TaskTruckUserRelation/GetTasksByFactoryId");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        response.map(task => {
            task.EntryDate = this.dateToString(new Date(task.EntryDate))
            task.DischargeDate = this.dateDifference(new Date(task.DischargeDate)) > 1000000 ? "-" : this.dateToString(new Date(task.DischargeDate))
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
        const result = await SwAlert({ icon: "success", title: "Görevi Sil", text: "Görevi Silmek İstediğinizden Emin misiniz?" })
        if (result.isConfirmed) {
            this.setState({ isLoading: true });

            const data = {
                Id: taskInfo.Id
            }

            const response = await HttpRequest(data, "/TaskTruckUserRelation/DeleteTaskRelation");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") {
                SwAlertToast({ icon: "error", title: "İşlem Sırasında Bir Hata Oluştu" });
                return;
            };

            if (response.IsSuccess) {
                SwAlertToast({ icon: "success", title: "Görevi Başarıyla Silindi" });
            } else {
                SwAlertToast({ icon: "error", title: "İşlem Sırasında Bir Hata Oluştu" });
            }

            this.setState({
                tasks: this.state.tasks.filter(item => item.Id != taskInfo.Id),
                filterTasks: this.state.filterTasks.filter(item => item.Id != taskInfo.Id),
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

    render() {
        const { isLoading, filterTasks, redirect, clickedTask } = this.state;

        if (redirect === PageConstant.ASSIGNED_TASK_DETAIL_PAGE_URL) {
            return <Redirect to={{ pathname: PageConstant.ASSIGNED_TASK_DETAIL_PAGE_URL, state: { task: clickedTask } }} push={true} />;
        }

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.FACTORY_TASK_VİEW} />
                <div className="content-wrapper pt-3">
                    <PageContent>
                        <MaterialTable
                            isLoading={isLoading}
                            icons={tableIcons}
                            options={tableOptions}
                            localization={tableLocalization}
                            actions={[
                                {
                                    icon: Delete,
                                    tooltip: "Görevi Sil",
                                    onClick: this.onDeleteTask
                                },
                                {
                                    icon: Assignment,
                                    tooltip: "Detayları Gör",
                                    onClick: this.goTaskDetailPage
                                }
                            ]}
                            columns={[
                                { title: "Araç", field: "Truck.Plaque" },
                                { title: "Kimin Adına Getirdiği", field: "Task.ConsumerName" },
                                { title: "Şoför", field: "User.Name" },
                                { title: "Telefon", field: "User.Phone" },
                                { title: "Damper", field: "Truck.IsTipper", lookup: { 1: "Damperli", 0: "Dampersiz" } },
                                { title: "Boşaltım Yaptımı", field: "DischargeDate" }
                            ]}
                            data={filterTasks}
                            title={"Atanmış Görev Listesi"}
                        />
                    </PageContent>
                </div>
            </div>
        )
    }
}
