import { isEmptyObject } from 'jquery'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import FormColumnText from '../../components/FormColumnText'
import Header from '../../components/Header'
import MapViewModal from '../../components/MapViewModal'
import Menu from '../../components/Menu'
import PageContent from '../../components/PageContent'
import PageContentHeader from '../../components/PageContentHeader'
import PhotoListModal from '../../components/PhotoListModal'
import AppConstant from '../../constant/app_constant'
import PageConstant from '../../constant/page_constant'
import { HttpRequest } from '../../services/services'

export default class AssignedTaskDetailView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        const task = props.location.state.task
        this.state = {
            relation: task,
            task: task.Task,
            truck: task.Truck,
            user: task.User,
            factory: {},
            task_date: task.EntryDate,
            discharge_date: task.DischargeDate,
            is_priority: task.IsPriority,
            isLoading: false,
            isDialogOpen: false,
            selectedLocation: {},
            redirect: "",
            photos: [],
            isPhotoDialogOpen: false
        }

        this.getFactoryInfo();
        this.getPhoto();
    }

    getFactoryInfo = async () => {
        const body = {
            "Id": this.state.task.FactoryId
        }

        let response = await HttpRequest(body, "/Factories/GetFactoryById");
        console.log(response)

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        this.setState({
            factory: response
        })
    }

    getPhoto = async () => {
        const body = {
            "Id": this.state.relation.Id
        }

        let response = await HttpRequest(body, "/TaskTruckUserRelation/GetPhoto");

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        let tmpResponse = [];
        response.map(item => {
            tmpResponse.push(item.Photo.Path)
        })

        this.setState({
            photos: tmpResponse
        })
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

    dialogClose = () => {
        this.setState({
            isDialogOpen: false,
        });
    };

    dialogPhotoClose = () => {
        this.setState({
            isPhotoDialogOpen: false,
        });
    };

    dialogOpen = () => {
        this.setState({
            isDialogOpen: true,
        });
    }

    showFactoryPoint = () => {
        if (!isEmptyObject(this.state.factory)) {
            this.setState({
                isDialogOpen: true,
                selectedLocation: {
                    "Lat": this.state.factory.Lat,
                    "Lon": this.state.factory.Lon,
                    "Tooltip": "Fabrika"
                }
            })
        }
    }

    showTaskPoint = () => {
        if (!isEmptyObject(this.state.factory)) {
            this.setState({
                isDialogOpen: true,
                selectedLocation: {
                    "Lat": this.state.task.GoodsLoadingAreaLat,
                    "Lon": this.state.task.GoodsLoadingAreaLon,
                    "Tooltip": "Mal Yükleme Noktası"
                }
            })
        }
    }

    showDriverRoute = () => {
        this.setState({
            redirect: PageConstant.TASK_ROUTE_MAP_VIEW
        })
    }

    showPhotos = async () => {
        this.setState({
            isPhotoDialogOpen: true
        })
    }

    render() {
        const { relation, task, truck, user, isPhotoDialogOpen, factory, photos, task_date, discharge_date, is_priority, isLoading, selectedLocation, isDialogOpen, redirect } = this.state;

        if (redirect === PageConstant.TASK_ROUTE_MAP_VIEW) {
            return <Redirect to={{ pathname: PageConstant.TASK_ROUTE_MAP_VIEW, state: { task: task, truck: truck, user: user, factory: factory, relation: relation } }} push={true} />;
        }

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.ASSIGNED_TASK_DETAIL_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1>Görev</h1>
                    </PageContentHeader>
                    <PageContent>
                        <div class="card card-info">
                            <div className="card-body">
                                <FormColumnText title="Görev İsmi" text={task.TaskTitle} />
                                <FormColumnText title="Kimin Adına Getireceği" text={task.ConsumerName} />
                                <FormColumnText title="Kayıt Yapan" text={task.RegistrantName} />
                                <FormColumnText title="Fabrika Adı" text={factory.Title ?? "Yükleniyor..."} />
                                <FormColumnText title="Fabrika Adresi" text={factory.Address ?? "Yükleniyor..."} />
                                <div className="d-flex">
                                    <label className="col-sm-2 col-form-label">
                                        Bilgiler
                                    </label>
                                    <div className="d-flex mr-3">
                                        <button onClick={this.showTaskPoint} className="btn btn-outline-success">Görev Noktasını Gör</button>
                                    </div>
                                    <div className="d-flex" >
                                        <button onClick={this.showFactoryPoint} className="btn btn-outline-info">Fabrika Konumu Gör</button>
                                    </div>
                                    <div className="d-flex ml-3" >
                                        <button onClick={this.showDriverRoute} className="btn btn-outline-secondary">Şoförün İzlediği Rotayı Gör</button>
                                    </div>
                                    <div className="d-flex ml-3" >
                                        <button onClick={this.showPhotos} className="btn btn-outline-primary">Fotoğrafları Gör</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PageContent>
                    <PageContentHeader>
                        <h1>Araç</h1>
                    </PageContentHeader>
                    <PageContent>
                        <div class="card card-info">
                            <div className="card-body">
                                <FormColumnText title="Marka" text={truck.Brand} />
                                <FormColumnText title="Model" text={truck.Model} />
                                <FormColumnText title="Plaka" text={truck.Plaque} />
                                <FormColumnText title="Damper" text={truck.IsTipper === 0 ? "Dampersiz" : "Damperli"} />
                            </div>
                        </div>
                    </PageContent>
                    <PageContentHeader>
                        <h1>Şoför</h1>
                    </PageContentHeader>
                    <PageContent>
                        <div class="card card-info">
                            <div className="card-body">
                                <FormColumnText title="Ad Soyad" text={user.Name + " " + user.SurName} />
                                <FormColumnText title="EMail" text={user.Email} />
                                <FormColumnText title="Telefon" text={user.Phone} />
                                <FormColumnText title="Kullanıcı Adı" text={user.Identity} />
                            </div>
                        </div>
                    </PageContent>
                </div>
                <MapViewModal showDialog={isDialogOpen} dialogClose={this.dialogClose} info={selectedLocation} />
                <PhotoListModal showDialog={isPhotoDialogOpen} dialogClose={this.dialogPhotoClose} photos={photos} />
            </div>
        )
    }
}
