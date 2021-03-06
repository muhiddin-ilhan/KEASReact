import React, { Component } from 'react'
import FormColumnSelect from '../../components/FormColumnSelect';
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageConstant from '../../constant/page_constant'
import ReactLoading from "react-loading";
import PageContent from '../../components/PageContent';
import PageContentHeader from '../../components/PageContentHeader'
import { HttpRequest } from '../../services/services';
import AppConstant from '../../constant/app_constant';
import { TextField } from '@material-ui/core'
import { SwAlertToast } from '../../components/SweetAlert';

export default class TaskAssignView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        this.state = {
            all_tasks: [],
            all_users: [],
            all_trucks: [],
            priority_options: this.getPriorityOptions(),
            task_id: "",
            user_id: "",
            truck_id: "",
            is_priority: "",
            task_time: new Date(),
            isLoading: false,
        }

        this.getAllTasks();
        this.getAllUsers();
        this.getAllTrucks();
    }

    getAllTasks = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        let body = ""
        if (user.VendorId !== 1) {
            body = {
                "VendorId": user.VendorId
            }
        }

        let response = await HttpRequest(body, "/Task/GetAllTasks");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        let tmpResponse = []
        response.map(task => {
            tmpResponse.push({ "Id": task.Id, "Title": task.TaskTitle })
        })

        this.setState({
            all_tasks: tmpResponse
        })
    }

    getAllUsers = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        let body = ""
        if (user.VendorId !== 1) {
            body = {
                "VendorId": user.VendorId
            }
        }

        let response = await HttpRequest(body, "/User/GetAllUser");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        response = response.filter(user => user.Role.RoleCode === 1);

        let tmpResponse = []
        response.map(user => {
            tmpResponse.push({ "Id": user.Id, "Title": user.Name + " " + user.SurName })
        })

        this.setState({
            all_users: tmpResponse
        })
    }

    getAllTrucks = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        let body = ""
        if (user.VendorId !== 1) {
            body = {
                "VendorId": user.VendorId
            }
        }

        let response = await HttpRequest(body, "/Truck/GetAllTrucks");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        let tmpResponse = []
        response.map(truck => {
            tmpResponse.push({ "Id": truck.Id, "Title": truck.Plaque + " (" + (truck.IsTipper === 1 ? "Damperli)" : "Dampersiz)") + " (" + truck.Brand + " " + truck.Model + ")" })
        })

        this.setState({
            all_trucks: tmpResponse
        })
    }

    getPriorityOptions = () => {
        return [{ "Id": 0, "Title": "??ncelik Yok" }, { "Id": 1, "Title": "??ncelikli" }]
    }

    changeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    validateInputs = () => {
        const { task_id, user_id, truck_id, is_priority, task_time } = this.state;

        if (task_id === "" || task_id === null || task_id === "-1") return false;
        if (user_id === "" || user_id === null || user_id === "-1") return false;
        if (truck_id === "" || truck_id === null || truck_id === "-1") return false;
        if (is_priority === "" || is_priority === null || is_priority === "-1") return false;
        if (task_time === "" || task_time === null) return false;

        return true;
    }

    onAssignTask = async () => {
        const { task_id, user_id, truck_id, is_priority, task_time } = this.state;

        if (this.validateInputs()) {
            this.setState({ isLoading: true });

            const body = {
                "TaskId": task_id,
                "UserId": user_id,
                "TruckId": truck_id,
                "IsPriority": is_priority,
                "EntryDate": task_time
            };

            const response = await HttpRequest(body, "/TaskTruckUserRelation/InsertTaskRelation");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") return;

            if (response.IsSuccess) {
                SwAlertToast({ icon: 'success', title: '????lem Ba??ar??yla Ger??ekle??ti' });
            } else {
                SwAlertToast({ icon: 'error', title: '????lem S??ras??nda Bir Hata Olu??tu' });
            }
        } else {
            SwAlertToast({ icon: 'error', title: '????lem S??ras??nda Bir Hata Olu??tu' });
        }
    }

    render() {
        const { all_tasks, all_trucks, all_users, task_id, user_id, truck_id, is_priority, task_time, isLoading, priority_options } = this.state;

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.TASK_ASSIGN_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">G??rev Atamas?? Yap</h1>
                    </PageContentHeader>
                    <PageContent>
                        <div class="card card-info">
                            <div className="card-body">
                                <FormColumnSelect title="G??rev" onChange={this.changeInput} value={task_id} name={"task_id"} items={all_tasks} />
                                <FormColumnSelect title="Ara??" onChange={this.changeInput} value={truck_id} name={"truck_id"} items={all_trucks} />
                                <FormColumnSelect title="??of??r" onChange={this.changeInput} value={user_id} name={"user_id"} items={all_users} />
                                <FormColumnSelect title="??ncelik" onChange={this.changeInput} value={is_priority} name={"is_priority"} items={priority_options} />
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">
                                        G??rev Tarihi
                                    </label>
                                    <div className="col-sm-10" style={{ paddingLeft: 14 }}>
                                        <TextField
                                            id="datetime-local"
                                            type="datetime-local"
                                            value={task_time}
                                            defaultValue={task_time}
                                            onChange={this.changeInput}
                                            name="task_time"
                                            className="form-control"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-12 mt-3">
                                        <button disabled={isLoading} onClick={this.onAssignTask} class="btn btn-block btn-outline-success">
                                            {isLoading ? (
                                                <ReactLoading className={"ml-md-auto mr-md-auto"} type={"spinningBubbles"} color={"#000"} height={"1.5%"} width={"1.5%"} />
                                            ) : (
                                                "Atama Yap"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PageContent>
                </div>
            </div>
        )
    }
}
