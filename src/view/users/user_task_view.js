import React, { Component } from 'react'
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageContent from '../../components/PageContent'
import PageContentHeader from '../../components/PageContentHeader'
import PageConstant from '../../constant/page_constant'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import L, { withLeaflet } from 'leaflet'
import '../../css/geosearch.css';
import '../../css/leaflet.css';
import TaskList from '../../components/TaskList'
import { BmsGetRoute, HttpRequest } from '../../services/services'
import AppConstant from '../../constant/app_constant'
import ReactLoading from "react-loading";
import { SwAlert, SwAlertToast } from '../../components/SweetAlert'
import { isEmptyObject } from 'jquery'
import { WarehouseMarker, WoodMarker, PointIcon } from '../../config/react_leaflet_icons'
import AlertDialog from '../../components/AlertDialog';


const searchControl = new GeoSearchControl({
    provider: new OpenStreetMapProvider({
        params: {
            'accept-language': 'tr',
            countrycodes: 'tr'
        },
    }),
    showMarker: true, // optional: true|false  - default true
    showPopup: false, // optional: true|false  - default false
    style: 'bar',
    position: 'topright',
    marker: {
        icon: new L.Icon.Default(),
        draggable: false,
    },
    popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
    resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
    maxMarkers: 1, // optional: number      - default 1
    retainZoomLevel: false, // optional: true|false  - default false
    animateZoom: true, // optional: true|false  - default true
    autoClose: true, // optional: true|false  - default false
    searchLabel: 'Ara...', // optional: string      - default 'Enter address'
    keepResult: false, // optional: true|false  - default false
    updateMap: true, // optional: true|false  - default true
});


export default class UserTaskView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        this.state = {
            map: null,
            route: [],
            originalRoute: [],
            originPoint: "12 12",
            destinationPoint: "12 12",
            shipments: [],
            filterShipments: [],
            selectedShipment: {},
            selectedShipmentInfo: {},
            routeInfo: null,
            isSelected: 0,
            isCompleted: true,
            isNotCompleted: false,
            user: props.location.state.user,
            isLoading: true,
            isDialogOpen: false
        }

        this.getSelectedUserTask();
    }

    getSelectedUserTask = async () => {
        const { user } = this.state;

        const response = await HttpRequest({ UserId: user.Id }, "/Shipment/GetAllShipmentByUserId");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;


        let tmpShipment = [];
        response.map(item => {
            const iTaskDate = new Date(item.TaskDate);
            const iDeliveryDate = new Date(item.DeliveryDate);
            item.TaskDate = iTaskDate.getDate() + " " + iTaskDate.getMonthName() + " " + iTaskDate.getFullYear() + " " + iTaskDate.getHours() + ":" + iTaskDate.getMinutes();
            item.DeliveryDate = iDeliveryDate.getDate() + " " + iDeliveryDate.getMonthName() + " " + iDeliveryDate.getFullYear() + " " + iDeliveryDate.getHours() + ":" + iDeliveryDate.getMinutes();

            if (item.ShipmentState === 1) {
                tmpShipment.push(item);
            }
        })


        this.setState({
            shipments: response,
            filterShipments: tmpShipment
        })
    }

    onTaskClick = async (shipment) => {
        const { map, shipments } = this.state;

        map.target.flyToBounds([[shipment.TaskLat, shipment.TaskLon], [shipment.TargetLat, shipment.TargetLon]])

        this.setState({
            originPoint: shipment.TaskLon + " " + shipment.TaskLat,
            destinationPoint: shipment.TargetLon + " " + shipment.TargetLat,
            isShowOriginalRoute: false,
            isShowExitRoute: false,
            isShowDriverStopped: false,
            originalRoute: [],
            routeInfo: null,
            route: [],
            isLoading: true
        })

        let route = [];
        if (shipment.ShipmentState === 1) {
            route = await this.getTaskRoute(shipment);
        }

        const originalRoute = await this.showOriginalRoute(shipment.TaskLon + " " + shipment.TaskLat, shipment.TargetLon + " " + shipment.TargetLat);

        if (originalRoute === "Err") {
            this.setState({ isSelected: shipment.Id })
            SwAlertToast({ icon: "error", title: "??of??r??n Gitmesi Gereken Rota Getirilirken Hata Olu??tu" })
        }

        this.setState({
            route: route,
            isSelected: shipment.Id,
            selectedShipment: shipment,
            isLoading: false
        });
    }

    getTaskRouteInfo = async (shipment) => {
        const response = await HttpRequest({ ShipmentId: shipment.Id }, "/Route/GetDriverRouteInfo");

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") {
            this.setState({ isSelected: shipment.Id })
            SwAlertToast({ icon: "error", title: "??zet Bilgiler Getirilirken Hata Olu??tu" })
            return;
        }

        this.setState({
            routeInfo: response
        })

    }

    getTaskRoute = async (shipment) => {

        const response = await HttpRequest({ ShipmentId: shipment.Id }, "/Route/GetRouteByShipmentId");

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") {
            this.setState({ isSelected: shipment.Id })
            SwAlertToast({ icon: "error", title: "Rota Kayd?? Getirilirken Bir Hata Olu??tu" })
            return;
        }

        if (!response.length) {
            this.setState({ isSelected: shipment.Id })
            SwAlertToast({ icon: "info", title: "Bu G??reve Ait Rota Kayd?? Bulunamad??" })
            return;
        }

        return response;
    }

    showOriginalRoute = async (origin, dest) => {
        const { isShowOriginalRoute, originPoint, destinationPoint, map } = this.state;

        this.setState({ isShowOriginalRoute: !isShowOriginalRoute })

        console.log(origin + " ||| " + dest)

        const response = await BmsGetRoute(origin, dest);

        if (response === "Error") return "Err";

        if (response.data === null) return "Err";

        if (!response.data.length) return "Err";

        if (!response.data[0].features.length) return "Err";

        if (isEmptyObject(response.data[0].features[0].geometry)) return "Err";

        if (!response.data[0].features[0].geometry.coordinates.length) return "Err";

        let tmpRoute = []
        response.data[0].features[0].geometry.coordinates.map(point => {
            tmpRoute.push([point[1], point[0]])
        })

        this.setState({
            originalRoute: tmpRoute
        })
    }

    getDriveRouteInfo = async () => {
        const { selectedShipment } = this.state;

        const response = await HttpRequest({ ShipmentId: selectedShipment.Id }, "/Route/GetDriverRouteInfo");

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") {
            SwAlertToast({ icon: "error", title: "Bir Hata Olu??tu Bilgiler ??ekilirken" })
            return;
        }

        this.setState({
            routeInfo: response
        })
    }

    getCompletedTask = async () => {
        const { shipments } = this.state;

        let tmpShipment = [];
        shipments.map(item => {
            if (item.ShipmentState === 1) {
                tmpShipment.push(item);
            }
        })

        this.setState({
            isCompleted: true,
            isNotCompleted: false,
            filterShipments: tmpShipment
        })
    }

    getInCompletedTask = async () => {
        const { shipments } = this.state;

        let tmpShipment = [];
        shipments.map(item => {
            if (item.ShipmentState === 0) {
                tmpShipment.push(item);
            }
        })

        this.setState({
            isCompleted: false,
            isNotCompleted: true,
            filterShipments: tmpShipment
        })
    }

    onCompletedOrNot = (isCompleted) => {
        this.setState({
            isCompleted: isCompleted ? true : false,
            isNotCompleted: isCompleted ? false : true
        })

        if (isCompleted) {
            this.getCompletedTask();
        } else {
            this.getInCompletedTask();
        }
    }

    mapFlyTo = (lat, lon, zoom) => {
        const { map } = this.state;
        map.target.flyTo([lat, lon], zoom === 0 ? 14 : zoom);
    }

    dialogClose = () => {
        this.setState({
            isDialogOpen: false,
        });
    };

    dialogOpen = () => {
        this.getDriveRouteInfo();
        this.setState({
            isDialogOpen: true,
        });
    }

    onDeleteShipment = async (shipment) => {
        const result = await SwAlert({ icon: "success", title: "G??revi Sil", text: "G??revi Silmek ??stedi??inizden Emin misiniz?" })
        if (result.isConfirmed) {
            this.setState({ isLoading: true });

            const data = {
                Id: shipment.Id
            }

            const response = await HttpRequest(data, "/Shipment/DeleteShipment");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
                return;
            };

            if (response.IsSuccess) {
                SwAlertToast({ icon: "success", title: "G??rev Ba??ar??yla Silindi" });
                window.location.reload();
            } else {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
            }
        }
    }

    dateToString = (date) => {
        return new Date(date).getDate() + " " + new Date(date).getMonthName() + " " + new Date(date).getFullYear() + " " + new Date(date).getHours() + ":" + new Date(date).getMinutes() + ":" + new Date(date).getSeconds();
    }

    render() {
        const { route, isDialogOpen, selectedShipment, routeInfo, filterShipments, isSelected, isCompleted, isNotCompleted, user, shipments, isLoading, originalRoute, originPoint, destinationPoint } = this.state;

        return (
            <>
                <Header />
                <Menu pageName={PageConstant.USER_TASK_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">{user.Name + " " + user.SurName + " G??revleri"}</h1>
                    </PageContentHeader>
                    <PageContent>
                        <div className="row mb-3" style={{ height: 550 }}>
                            <div className="col-md-9">
                                <MapContainer style={{ height: 550, width: '100%' }} center={[39.90, 32.85]} zoom={9} scrollWheelZoom={true}
                                    whenReady={(map) => {
                                        this.setState({ map })
                                        map.target.addControl(searchControl)
                                        //map.target.on("click", this.mapClick);
                                    }}>
                                    <TileLayer
                                        attribution=''
                                        url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                                    />
                                    {
                                        route.length > 2000 ?
                                            <Polyline
                                                key={2}
                                                positions={route.map(item => [item.Lat, item.Lon])}
                                                pathOptions={{ color: 'blue' }}
                                            /> :

                                            route.map(item =>
                                                <Marker position={[item.Lat, item.Lon]} icon={PointIcon}>
                                                    <Popup>
                                                        <span>{"Konum : " + item.Lat + ", " + item.Lon}</span><br />
                                                        <span>{"Zaman : " + this.dateToString(item.RecordDate)}</span><br />
                                                        <span>{"H??z : " + item.Speed}</span>
                                                    </Popup>
                                                </Marker>
                                            )

                                    }


                                    <Polyline
                                        key={1}
                                        positions={originalRoute}
                                        pathOptions={{ color: 'black' }}
                                    />
                                    <Marker position={[originPoint.split(" ")[1], originPoint.split(" ")[0]]} icon={WoodMarker} />
                                    <Marker position={[destinationPoint.split(" ")[1], destinationPoint.split(" ")[0]]} icon={WarehouseMarker} />
                                </MapContainer>
                            </div>
                            <div className="col-md-3">
                                {
                                    !isLoading ?
                                        <>
                                            <div className="p-1 mb-2" style={{ height: 40 }}>
                                                <div className="d-flex justify-content-between">
                                                    <div className={"btn flex-grow-1 mr-1 btn" + (isCompleted ? "" : "-outline") + "-success"} onClick={this.onCompletedOrNot.bind(this, true)}>
                                                        Yap??lan
                                                    </div>
                                                    <div className={"btn flex-grow-1 btn" + (isNotCompleted ? "" : "-outline") + "-danger"} onClick={this.onCompletedOrNot.bind(this, false)}>
                                                        Bekleyen
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-1" style={{ height: 500, overflowY: "scroll", overflowX: "hidden", backgroundColor: '#efefef', borderRadius: 10 }}>
                                                {
                                                    filterShipments.map(item =>
                                                        <TaskList onTaskClick={this.onTaskClick.bind(this)} onDeleteShipment={this.onDeleteShipment.bind(this)} isSelected={isSelected} item={item} mapFlyTo={this.mapFlyTo.bind(this)} dialogOpen={this.dialogOpen} />
                                                    )
                                                }
                                            </div>
                                        </>
                                        :
                                        <div className={"card"} style={{ height: 550 }}>
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: 550 }}>
                                                <ReactLoading type={"spinningBubbles"} color={"#000"} />
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </PageContent>
                </div>
                <AlertDialog showDialog={isDialogOpen} dialogClose={this.dialogClose} item={routeInfo} shipment={selectedShipment} />
            </>
        )
    }
}


Date.prototype.getMonthName = function () {
    var monthNames = ["Oca", "??ub", "Mar", "Nis", "May", "Haz", "Tem", "A??u", "Eyl", "Eki", "Kas", "Ara"];
    return monthNames[this.getMonth()];
};

