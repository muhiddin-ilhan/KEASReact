import React, { Component } from 'react'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageContent from '../../components/PageContent'
import PageConstant from '../../constant/page_constant'
import { MapContainer, Marker, Polyline, TileLayer, Popup, Tooltip, Polygon } from 'react-leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet'
import '../../css/geosearch.css';
import '../../css/leaflet.css';
import { BmsGetRoute, HttpRequest } from '../../services/services'
import AppConstant from '../../constant/app_constant'
import ReactLoading from "react-loading";
import { SwAlertToast } from '../../components/SweetAlert'
import LastRouteCardList from '../../components/LastRouteCardList'
import { DefaultIcon, PersonIcon, PersonIconYellow, PersonIconRed, PointIcon, pointMarker, WarehouseMarker, WoodMarker } from '../../config/react_leaflet_icons'
import CarListCard from '../../components/CarListCard'
import LiveRouteInfoModal from '../../components/LiveRouteInfoModal'
import { parse } from 'wellknown';

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

export default class HomeView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        this.state = {
            map: null,
            originPoint: [0, 0],
            destinationPoint: [0, 0],
            lastLocationInfos: [],
            filterLocationInfos: [],
            route: [],
            isSelectedUserId: 0,
            isShowBMSRoute: false,
            isShowCarList: true,
            isDialogOpen: false,
            isLoading: true,
            isLoadingDriverRoute: false,
            isLoadingOriginalRoute: false,
            timerId: "",
            dangerAreas: [],
            isShowDangerAreas: false
        }

        this.getAllDangerAreas()
    }

    componentWillUnmount() {
        clearInterval(this.state.timerId);
    }

    componentDidMount() {

        this.getLastKnownLocationUsers();
        setInterval(this.state.timerId);
    }

    getAllDangerAreas = async () => {
        let response = await HttpRequest("", "/Areas/GetAllDangerAreas");

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        let polygons = [];
        response.map(item => {
            polygons.push(parse(item.Polygon).coordinates[0]);
        })

        let tmpCoords = [];
        let tmpPolygons = [];
        polygons.map(item => {
            tmpCoords = [];
            item.map(i => {
                tmpCoords.push([i[1], i[0]])
            })
            tmpPolygons.push(tmpCoords);
        })

        this.setState({
            dangerAreas: tmpPolygons,
            isShowDangerAreas: true
        })
    }

    async getLastKnownLocationUsers() {
        const { timerId } = this.state;

        const timer = setInterval(async () => {
            if(localStorage.getItem("user") === null || undefined){
                window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
                return;
            }

            const user = JSON.parse(localStorage.getItem("user"));
            let body = ""
            if (user.Role.RoleCode === 4) {
                body = {
                    VendorId: user.VendorId
                }
            }

            console.log(".")
            const response = await HttpRequest(body, "/DriverRoute/GetLastKnownLocationUsers");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") return;

            if (!response.length) return;

            const sortedResponse = response.sort((a, b) => b.Id - a.Id)

            this.setState({
                lastLocationInfos: sortedResponse,
                filterLocationInfos: this.state.filterLocationInfos.length === 1 ? [sortedResponse.find(item => item.User.Id === this.state.filterLocationInfos[0].User.Id)] : sortedResponse
            })

            // if(this.state.isSelectedUserId !== 0){
            //     const tmp = sortedResponse.find(item => item.User.Id === this.state.isSelectedUserId);
            //     this.mapFlyTo(tmp.Lat, tmp.Lon)
            // }
        }, 5000);

        this.setState({
            timerId: timer
        })
    }

    onMarkerClick = (info, e) => {
        console.log(info);
    }

    onTaskCardClick = (info) => {
        const { lastLocationInfos, isSelectedUserId, map } = this.state;

        if (info.User.Id === isSelectedUserId) {
            this.setState({
                isSelectedUserId: 0,
                filterLocationInfos: lastLocationInfos,
                originPoint: [0, 0],
                destinationPoint: [0, 0],
                route: [],
                savedRoute: []
            });
            //map.target.flyTo([39, 34], 6);
            return;
        }

        const selectedLocationInfo = lastLocationInfos.find((item) => item.Id === info.Id);


        this.setState({
            isSelectedUserId: info.User.Id,
            filterLocationInfos: [selectedLocationInfo],
            originPoint: [selectedLocationInfo.Task.GoodsLoadingAreaLat, selectedLocationInfo.Task.GoodsLoadingAreaLon],
            destinationPoint: [selectedLocationInfo.Task.Factory.Lat, selectedLocationInfo.Task.Factory.Lon],
            route: [],
            savedRoute: [],
            isShowDriverRoute: false,
            isShowBMSRoute: false
        })

        // if (map !== null) {
        //     map.target.flyTo([info.Lat, info.Lon]);
        // }

    }

    onShowBMSRoute = async () => {
        const { filterLocationInfos, isShowBMSRoute } = this.state;

        if (isShowBMSRoute) {
            this.setState({ isShowBMSRoute: false, route: [] });
            return;
        };

        this.setState({ isLoadingOriginalRoute: true })

        const response = await BmsGetRoute(filterLocationInfos[0].Task.GoodsLoadingAreaLon + " " + filterLocationInfos[0].Task.GoodsLoadingAreaLat, filterLocationInfos[0].Task.Factory.Lon + " " + filterLocationInfos[0].Task.Factory.Lat);
        console.log(response);
        if (response === "Error") {
            SwAlertToast({ icon: "error", title: "Rota Olu??turulurken Hata Meydana Geldi" })
            this.setState({ isLoadingOriginalRoute: false })
            return;
        };

        if (response.data === null) {
            SwAlertToast({ icon: "error", title: "Rota Olu??turulurken Hata Meydana Geldi" })
            this.setState({ isLoadingOriginalRoute: false })
            return;
        };

        if (!(response.data[0].features[0].geometry.coordinates.length)) {
            SwAlertToast({ icon: "error", title: response.message })
            this.setState({ isLoadingOriginalRoute: false })
            return;
        }

        let coords = [];
        response.data[0].features[0].geometry.coordinates.map(coord => {
            coords.push([coord[1], coord[0]])
        });

        this.setState({
            route: coords,
            isShowBMSRoute: true,
            isLoadingOriginalRoute: false
        })
        this.mapFlyToBounds(filterLocationInfos[0].Task.GoodsLoadingAreaLat, filterLocationInfos[0].Task.GoodsLoadingAreaLon, filterLocationInfos[0].Task.Factory.Lat, filterLocationInfos[0].Task.Factory.Lon)
    }

    mapFlyTo = (lat, lon, zoom) => {
        const { map } = this.state;
        map.target.flyTo([lat, lon], zoom === 0 ? 14 : zoom);
    }

    mapFlyToBounds = (lat1, lon1, lat2, lon2) => {
        const { map } = this.state;
        map.target.flyToBounds([[lat1, lon1], [lat2, lon2]])
    }

    dateToString = (date) => {
        return new Date(date).getDate() + " " + new Date(date).getMonthName() + " " + new Date(date).getFullYear() + " " + new Date(date).getHours() + ":" + new Date(date).getMinutes();
    }

    dialogClose = () => {
        this.setState({
            isDialogOpen: false,
        });
    };

    dialogOpen = () => {
        this.setState({
            isDialogOpen: true,
        });
    }

    dateDifference = (date) => {
        const time = new Date().getTime() - new Date(date).getTime();
        const minute = Math.floor(time / (1000 * 60));
        return minute;
    }

    onHideShowCarList = () => {
        this.setState({
            isShowCarList: !this.state.isShowCarList
        })
    }

    render() {
        const { isSelectedUserId, isShowCarList, isShowDangerAreas, dangerAreas ,originPoint, isShowBMSRoute, destinationPoint, lastLocationInfos, filterLocationInfos, route, isDialogOpen } = this.state;
        const height = window.innerHeight;
        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.MAIN_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContent>
                        <div style={{ height: height * 0.9, position: 'relative' }}>
                            {
                                isShowCarList &&
                                <div style={{ overflowX: 'scroll', position: 'absolute', right: 0, height: height * 0.9, width: 400, backgroundColor: '#00000042', zIndex: 2 }}>
                                    {
                                        lastLocationInfos.map(item =>
                                            <CarListCard dialogOpen={this.dialogOpen.bind(this)} isShowBmwRoute={isShowBMSRoute} drawRoute={this.onShowBMSRoute.bind(this)} onTaskClick={this.onTaskCardClick.bind(this)} isSelected={isSelectedUserId} item={item} mapFlyTo={this.mapFlyTo.bind(this)} />
                                        )
                                    }
                                </div>
                            }

                            <div onClick={this.onHideShowCarList} className="justify-content-center align-items-center" style={{ cursor: 'pointer', position: 'absolute', right: isShowCarList ? 410 : 0, height: height * 0.9, width: 20, backgroundColor: '#00000042', zIndex: 2 }}>
                                <i style={{ position: 'absolute', top: 380, left: 4 }} className={"fas fa-arrow-" + (isShowCarList ? "right" : "left")}></i>
                            </div>

                            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }}>
                                <MapContainer style={{ height: height * 0.9, width: '100%' }} center={[39.90, 32.85]} zoom={9} scrollWheelZoom={true}
                                    whenReady={(map) => {
                                        this.setState({ map })
                                        map.target.addControl(searchControl)
                                        //map.target.on("click", this.mapClick);
                                    }}>
                                    <TileLayer
                                        attribution=''
                                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                    />
                                    <Polyline
                                        key={3}
                                        positions={route.length ? route : [[12, 12]]}
                                        pathOptions={{ color: 'black' }}
                                        weight={8}
                                    />
                                    {
                                        isShowDangerAreas && <Polygon
                                            key={3}
                                            positions={dangerAreas}
                                            pathOptions={{ fill: true, fillColor: 'red', color: 'red' }}
                                        />
                                    }
                                    {
                                        filterLocationInfos.map(info =>
                                            <Marker icon={this.dateDifference(info.RecordDate) > 120 ? this.dateDifference(info.RecordDate) > 300 ? PersonIconRed : PersonIconYellow : PersonIcon} key={info.UserId} position={[info.Lat, info.Lon]} eventHandlers={{ click: this.onMarkerClick.bind(this, info) }}>
                                                <Tooltip permanent={true} direction="top" offset={L.point(0, -10)}>
                                                    {info.Truck.Plaque + " " + info.User.Name}
                                                </Tooltip>
                                                <Popup>
                                                    <table>
                                                        <tr>
                                                            <th>{"Ara?? : "}</th>
                                                            <td className="ml-3">{"  " + info.Truck.Brand + " " + info.Truck.Model}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>{"Plaka : "}</th>
                                                            <td className="ml-3">{"  " + info.Truck.Plaque}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>{"H??z : "}</th>
                                                            <td className="ml-3">{"  " + info.Speed + " km/s"}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>{"Telefon : "}</th>
                                                            <td className="ml-3">{"  " + info.User.Phone}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>{"S??r??c?? : "}</th>
                                                            <td className="ml-3">{"  " + info.User.Name + " " + info.User.SurName}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>{"Tarih : "}</th>
                                                            <td className="ml-3">{"  " + this.dateToString(info.RecordDate)}</td>
                                                        </tr>
                                                    </table>
                                                </Popup>
                                            </Marker>)
                                    }
                                    {/* {savedRoute.map((item, idx) =>
                                        <Marker key={idx} position={[item.Lat, item.Lon]} icon={PointIcon}>
                                            <Popup>
                                                <span>{"Konum : " + item.Lat + ", " + item.Lon}</span><br />
                                                <span>{"Zaman : " + this.dateToString(item.RecordDate)}</span><br />
                                                <span>{"H??z : " + item.Speed}</span>
                                            </Popup>
                                        </Marker>)
                                    } */}
                                    <Marker position={originPoint} title="Mal Y??kleme Noktas??" icon={WoodMarker} >
                                        <Tooltip permanent={true} direction="top" offset={L.point(0, -10)}>
                                            Mal Y??kleme Noktas??
                                        </Tooltip>
                                    </Marker>
                                    <Marker position={destinationPoint} icon={WarehouseMarker} >
                                        <Tooltip permanent={true} direction="top" offset={L.point(0, -10)}>
                                            Fabrika Konumu
                                        </Tooltip>
                                    </Marker>
                                </MapContainer>
                            </div>

                            {/* <div className="col-md-3">
                                {
                                    !isLoading ?
                                        <div className="p-1" style={{ height: 550, overflowY: "scroll", overflowX: "hidden", backgroundColor: '#efefef', borderRadius: 10 }}>
                                            {
                                                lastLocationInfos.map(item =>
                                                    <LastRouteCardList key={item.Id} onTaskClick={this.onTaskCardClick.bind(this)} isSelectedUserId={isSelectedUserId} item={item} mapFlyTo={this.mapFlyTo.bind(this)} />
                                                )
                                            }
                                        </div>
                                        :
                                        <div className={"card"} style={{ height: 550 }}>
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: 550 }}>
                                                <ReactLoading type={"spinningBubbles"} color={"#000"} />
                                            </div>
                                        </div>
                                }

                            </div> */}
                        </div>
                        {/* {
                            isSelectedUserId !== 0 ? <div className="d-flex justify-content-between">
                                <button disabled={isLoadingDriverRoute} className={"btn  d-flex justify-content-center flex-grow-1 mr-1 btn" + (isShowDriverRoute ? "" : "-outline") + "-warning"} onClick={this.getClickedTaskSavedRoute.bind(this)}>
                                    {isLoadingDriverRoute ? <ReactLoading type={"spinningBubbles"} color={"#000"} width={"4%"} height={"4%"} /> : "??of??r??n Gitti??i Rotay?? G??r"}
                                </button>
                                <button disabled={isLoadingOriginalRoute} className={"btn d-flex justify-content-center flex-grow-1 mr-1 btn" + (isShowBMSRoute ? "" : "-outline") + "-success"} onClick={this.onShowBMSRoute.bind(this)}>
                                    {isLoadingOriginalRoute ? <ReactLoading type={"spinningBubbles"} color={"#000"} width={"4%"} height={"4%"} /> : "??of??r??n Gitmesi Gereken Rotay?? G??ster"}
                                </button>
                            </div> : null
                        } */}
                    </PageContent>
                    {
                        filterLocationInfos.length && <LiveRouteInfoModal showDialog={isDialogOpen} dialogClose={this.dialogClose} info={filterLocationInfos[0]} />
                    }
                </div>
            </div>
        )
    }
}
