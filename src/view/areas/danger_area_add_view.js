import { isEmptyObject } from 'jquery';
import React, { Component } from 'react'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw';
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageContent from '../../components/PageContent'
import PageConstant from '../../constant/page_constant'
import { stringify } from 'wellknown';
import FormColumn from '../../components/FormColumn';
import { polygon } from 'leaflet';
import AppConstant from '../../constant/app_constant';
import { SwAlertToast } from '../../components/SweetAlert';
import { HttpRequest } from '../../services/services';

export default class DangerAreaAddView extends Component {
    constructor(props) {
        super(props);

        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
    }

    state = {
        polygon: {},
        title: "",
        refresh: 0
    }

    onEdited = (item) => {
        const geoJson = item.layers.toGeoJSON();
        const wkt = stringify(geoJson.features[0]);
        this.setState({
            polygon: wkt
        })
        console.log(wkt)
    }

    onCreated = (item) => {
        const geoJson = item.layer.toGeoJSON();
        const wkt = stringify(geoJson);
        this.setState({
            polygon: wkt
        })
        console.log(wkt)
    }

    onDeleted = (item) => {
        console.log(item)
        this.setState({
            polygon: {},
            refresh: 1
        })
        setTimeout(() => {
            this.setState({
                refresh: 0
            })
        }, 1)
    }

    changeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    validateInputs = () => {
        const { title, polygon } = this.state;

        if (title === "" || title === null) return false;
        if (isEmptyObject(polygon) || polygon === null) return false;

        return true;
    }

    onSaveDangerArea = async () => {
        const { polygon, title } = this.state;

        if (this.validateInputs()) {
            const body = {
                "AreaTitle": title,
                "Polygon": polygon
            };

            const response = await HttpRequest(body, "/Areas/InsertDangerArea");

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") return;

            if (response.IsSuccess) {
                SwAlertToast({ icon: 'success', title: '????lem Ba??ar??yla Ger??ekle??ti' });
            } else {
                SwAlertToast({ icon: 'error', title: '????lem S??ras??nda Bir Hata Olu??tu' });
            }

            this.onDeleted();
        }
    }

    render() {
        const { polygon, refresh, title } = this.state;
        const height = window.innerHeight;
        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.DANGER_AREA_ADD_VIEW} />
                <div className="content-wrapper pt-2">
                    <PageContent>
                        <div style={{ height: height * 0.9, position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }}>
                                {
                                    refresh === 0 &&
                                    <MapContainer style={{ height: height * 0.9, width: '100%' }} center={[39.90, 32.85]} zoom={9} scrollWheelZoom={true}
                                        whenReady={(map) => {
                                            this.setState({ map: map })
                                        }}>
                                        <FeatureGroup>
                                            <EditControl
                                                position="topright"
                                                onEdited={this.onEdited}
                                                onCreated={this.onCreated}
                                                onDeleted={this.onDeleted}
                                                draw={{
                                                    rectangle: false,
                                                    circle: false,
                                                    circlemarker: false,
                                                    marker: false,
                                                    polygon: isEmptyObject(polygon) ? true : false,
                                                    polyline: false
                                                }}
                                            />
                                        </FeatureGroup>
                                        <TileLayer
                                            attribution=''
                                            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                        />
                                    </MapContainer>
                                }
                            </div>
                            <div style={{ position: 'absolute', left: 0, right: 0, bottom: -17, zIndex: 1 }}>
                                <div class="card card-info">
                                    <div className="card-body">
                                        <FormColumn title="Alan??n Ad??" onChange={this.changeInput} value={title} name={"title"} />
                                        <button onClick={this.onSaveDangerArea} className="btn btn-block btn-success" disabled={isEmptyObject(polygon)}>Tehlikeli Alan Olarak Kaydet</button>
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
