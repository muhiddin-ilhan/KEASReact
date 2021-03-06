import React, { Component } from 'react'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageConstant from '../../constant/page_constant'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import '../../css/leaflet.css';
import PageContent from '../../components/PageContent'
import { WarehouseMarker, WoodMarker } from '../../config/react_leaflet_icons'
import FormColumn from '../../components/FormColumn'
import FormColumnSelect from '../../components/FormColumnSelect'
import { HttpRequest } from '../../services/services'
import { SwAlertToast } from '../../components/SweetAlert'
import AppConstant from '../../constant/app_constant'
import ReactLoading from "react-loading";

export default class TaskAddView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        const localUser = JSON.parse(localStorage.getItem("user"))
        this.state = {
            localUser: localUser,
            lat: "",
            lon: "",
            is_select_map: false,
            title: "",
            consumer_name: "",
            registrant_name: "",
            factory: "",
            vendor: "",
            isLoading: false,
            all_factories: [],
            all_vendors: []
        }

        this.getAllFactories();
        this.getAllVendors();
    }

    getAllFactories = async () => {

        const response = await HttpRequest("", "/Factories/GetAllFactories");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        this.setState({
            all_factories: response
        })
    }

    getAllVendors = async () => {

        const response = await HttpRequest("", "/Vendor/GetAllVendors");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        this.setState({
            all_vendors: response
        })
    }

    changeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    selectOnMap = () => {
        const { is_select_map } = this.state;
        this.setState({
            is_select_map: !is_select_map
        })
    }

    onMapClick = (e) => {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        this.setState({
            lat,
            lon
        })
    }

    validateInputs = () => {
        const { title, lat, lon, consumer_name, registrant_name, factory, vendor, localUser } = this.state;

        if (title === "" || title === null) return false;
        if (lat === "" || lat === null) return false;
        if (lon === "" || lon === null) return false;
        if (consumer_name === "" || consumer_name === null) return false;
        if (registrant_name === "" || registrant_name === null) return false;
        if (factory === "" || factory === null || factory === "-1") return false;
        if (localUser.Role.RoleCode !== 4) {
            if (vendor === "" || vendor === null || vendor === "-1") return false;
        }

        return true;
    }

    onInsertTask = async () => {
        const { title, lat, lon, consumer_name, registrant_name, factory, vendor, localUser } = this.state;

        if (this.validateInputs()) {
            this.setState({ isLoading: true });

            const body = {
                "TaskTitle": title,
                "GoodsLoadingAreaLat": lat,
                "GoodsLoadingAreaLon": lon,
                "ConsumerName": consumer_name,
                "RegistrantName": registrant_name,
                "FactoryId": factory,
                "VendorId": localUser.Role.RoleCode !== 4 ? vendor : localUser.VendorId
            };

            const response = await HttpRequest(body, "/Task/InsertTask");

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
        const { title, lat, lon, is_select_map, consumer_name, registrant_name, factory, vendor, isLoading, all_factories, all_vendors, localUser } = this.state;
        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.TASK_ADD_PAGE_URL} />
                <div className="content-wrapper pt-3">
                    <PageContent>
                        <div className="row">
                            {
                                is_select_map &&
                                <div className="col-md-12 mb-3">
                                    <MapContainer style={{ height: 465, width: '100%' }} center={[39.90, 32.85]} zoom={9} scrollWheelZoom={true}
                                        whenReady={(map) => {
                                            map.target.on("click", this.onMapClick);
                                        }}>
                                        <TileLayer
                                            attribution=''
                                            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                        />
                                        {lat !== "" && lon !== "" ? <Marker position={[lat, lon]} icon={WoodMarker} /> : null}
                                    </MapContainer>
                                </div>
                            }

                            <div className="col-md-12">
                                <div className="card text-center align-self-stretch">
                                    <h5 className="card-header">
                                        Mal Y??kleme Noktas??
                                    </h5>
                                    <div className="card-body">
                                        <div className="form-group text-center d-flex">
                                            <input type="text" value={lat} onChange={this.changeInput} name="lat" className="form-control flex-grow-1 mr-1" placeholder="Mal Y??kleme Noktas?? Lat (X)" />
                                            <input type="text" value={lon} onChange={this.changeInput} name="lon" className="form-control flex-grow-1 ml-1" placeholder="Mal Y??kleme Noktas?? Lon (Y)" />
                                        </div>
                                        <button type="button" onClick={this.selectOnMap} className={"btn btn-block btn-" + (is_select_map ? "info" : "outline-info")}>Haritadan Se??</button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="card card-info">
                            <div className="card-body">
                                <FormColumn title="G??rev Ba??l??????" onChange={this.changeInput} value={title} name={"title"} />
                                <FormColumn title="Kimin Ad??na Getirece??i" onChange={this.changeInput} value={consumer_name} name={"consumer_name"} />
                                <FormColumn title="Kay??t Yapan" onChange={this.changeInput} value={registrant_name} name={"registrant_name"} />
                                <FormColumnSelect title="Teslimat Yapaca???? Fabrika" onChange={this.changeInput} value={factory} name={"factory"} items={all_factories} />
                                {
                                    localUser.Role.RoleCode !== 4 && <FormColumnSelect title="Tedarik??i" onChange={this.changeInput} value={vendor} name={"vendor"} items={all_vendors} />
                                }
                                <div className="form-group row">
                                    <div className="col-sm-12 mt-3">
                                        <button disabled={isLoading} onClick={this.onInsertTask} class="btn btn-block btn-outline-success">
                                            {isLoading ? (
                                                <ReactLoading className={"ml-md-auto mr-md-auto"} type={"spinningBubbles"} color={"#000"} height={"1.5%"} width={"1.5%"} />
                                            ) : (
                                                "Ekle"
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
