import React, { Component } from 'react'
import Header from '../../components/Header'
import PageConstant from '../../constant/page_constant'
import Menu from '../../components/Menu'
import PageContent from '../../components/PageContent'
import { MapContainer, TileLayer, Marker, Tooltip, Popup, Polyline, Polygon } from 'react-leaflet'
import { PointIcon, WarehouseMarker, WoodMarker } from '../../config/react_leaflet_icons'
import L from 'leaflet'
import { BmsGetRoute, HttpRequest } from '../../services/services'
import AppConstant from '../../constant/app_constant'
import { SwAlertToast } from '../../components/SweetAlert'
import { parse } from 'wellknown';

export default class TaskRouteMapView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        const truck = props.location.state.truck
        const user = props.location.state.user
        const task = props.location.state.task
        const relation = props.location.state.relation
        const factory = props.location.state.factory
        this.state = {
            map: null,
            truck: truck,
            user: user,
            task: task,
            relation: relation,
            factory: factory,
            taskPoint: [task.GoodsLoadingAreaLat, task.GoodsLoadingAreaLon],
            factoryPoint: [factory.Lat, factory.Lon],
            driverRoute: [],
            driverRoutePoint: [],
            bmsRoute: [],
            isShowDriverRoute: false,
            isShowBmsRoute: false,
            isShowDangerAreas: false,
            dangerAreas: []
        }

        console.log(props.location.state);

        this.getDriverRoute(relation.Id);
        this.onShowBMSRoute();
        this.getAllDangerAreas();
    }

    getDriverRoute = async (relationId) => {
        const body = {
            "RelationId": relationId
        }

        let response = await HttpRequest(body, "/DriverRoute/GetDriverRouteByRelationId");

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) {
            SwAlertToast({ icon: "error", title: "Şöforun Kayıtlı Rotası Yok" })
            return;
        };

        let tmpRoute = [];
        response.map(route => {
            tmpRoute.push([route.Lat, route.Lon])
        });

        this.setState({
            driverRoute: response,
            driverRoutePoint: tmpRoute,
            isShowDriverRoute: true
        })
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

    onShowBMSRoute = async () => {
        const { taskPoint, factoryPoint } = this.state;

        const response = await BmsGetRoute(taskPoint[1] + " " + taskPoint[0], factoryPoint[1] + " " + factoryPoint[0]);

        if (response === "Error") {
            SwAlertToast({ icon: "error", title: "Rota Oluşturulurken Hata Meydana Geldi" })
            this.setState({ isLoadingOriginalRoute: false })
            return;
        };

        if (response.data === null) {
            SwAlertToast({ icon: "error", title: "Rota Oluşturulurken Hata Meydana Geldi" })
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
            bmsRoute: coords,
            isShowBmsRoute: true
        })
        this.mapFlyToBounds(taskPoint[0], taskPoint[1], factoryPoint[0], factoryPoint[1])
    }

    dateToString = (date) => {
        return new Date(date).getDate() + " " + new Date(date).getMonthName() + " " + new Date(date).getFullYear() + " " + new Date(date).getHours() + ":" + new Date(date).getMinutes();
    }

    mapFlyToBounds = (lat1, lon1, lat2, lon2) => {
        const { map } = this.state;
        if (map !== null) {
            map.target.flyToBounds([[lat1, lon1], [lat2, lon2]])
        }
    }

    showBmwRouteButtonClick = () => {
        if (!(this.state.bmsRoute.length)) {
            SwAlertToast({ icon: "error", title: "Rota Oluştururken Hata Oluştu" })
        } else {
            this.setState({
                isShowBmsRoute: !this.state.isShowBmsRoute
            })
        }
    }

    showDriverRouteButtonClick = () => {
        if (!(this.state.bmsRoute.length)) {
            SwAlertToast({ icon: "error", title: "Rota Oluştururken Hata Oluştu" })
        } else {
            this.setState({
                isShowDriverRoute: !this.state.isShowDriverRoute
            })
        }
    }

    render() {
        const { taskPoint, factoryPoint, driverRoutePoint, bmsRoute, isShowBmsRoute, isShowDriverRoute, isShowDangerAreas, dangerAreas } = this.state;
        const height = window.innerHeight;
        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.TASK_ROUTE_MAP_VIEW} />
                <div className="content-wrapper pt-2">
                    <PageContent>
                        <div style={{ height: height * 0.9, position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }}>
                                <MapContainer style={{ height: height * 0.9, width: '100%' }} center={[39.90, 32.85]} zoom={9} scrollWheelZoom={true}
                                    whenReady={(map) => {
                                        this.setState({ map: map })
                                    }}>
                                    <TileLayer
                                        attribution=''
                                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                    />
                                    {
                                        isShowBmsRoute && <Polyline
                                            key={2}
                                            positions={bmsRoute.length ? bmsRoute : [[12, 12]]}
                                            pathOptions={{ color: 'black' }}
                                            weight={8}
                                        />
                                    }
                                    {
                                        isShowDriverRoute && <Polyline
                                            key={1}
                                            positions={driverRoutePoint.length ? driverRoutePoint : [[12, 12]]}
                                            pathOptions={{ color: 'purple' }}
                                            weight={5}
                                        />
                                    }
                                    {
                                        isShowDangerAreas && <Polygon
                                            key={3}
                                            positions={dangerAreas}
                                            pathOptions={{ fill: true, fillColor: 'red', color: 'red' }}
                                        />
                                    }
                                    <Marker position={taskPoint} title="Mal Yükleme Noktası" icon={WoodMarker} >
                                        <Tooltip permanent={true} direction="top" offset={L.point(0, -10)}>
                                            Mal Yükleme Noktası
                                        </Tooltip>
                                    </Marker>
                                    <Marker position={factoryPoint} icon={WarehouseMarker} >
                                        <Tooltip permanent={true} direction="top" offset={L.point(0, -10)}>
                                            Fabrika Konumu
                                        </Tooltip>
                                    </Marker>
                                </MapContainer>
                            </div>
                            <div style={{ position: 'absolute', right: 20, top: 10, zIndex: 1 }}>
                                <div className="row">
                                    <button onClick={this.showBmwRouteButtonClick} className="btn btn-info">{isShowBmsRoute ? "Gitmesi Gereken Rotayı Gizle" : "Gitmesi Gereken Rotayı Göster"}</button>
                                    <button onClick={this.showDriverRouteButtonClick} className="btn btn-success mt-2">{isShowDriverRoute ? "Şoförün Rotasını Gizle" : "Şoförün Rotasını Göster"}</button>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', right: 20, bottom: 10, zIndex: 1 }}>
                                <div className="row text-center" >
                                    <label className="p-2 mr-2" style={{ backgroundColor: 'red', color: 'white', borderRadius: 10 }}>Yasaklanmış Bölgeler</label><br />
                                    <label className="p-2" style={{ backgroundColor: 'purple', color: 'white', borderRadius: 10 }}>Şoförün Gittiği Rota</label><br />
                                    <label className="p-2" style={{ backgroundColor: 'black', color: 'white', borderRadius: 10 }}>Gitmesi Gereken Rota</label>
                                </div>
                            </div>
                        </div>
                    </PageContent>
                </div>
            </div>
        )
    }
}
