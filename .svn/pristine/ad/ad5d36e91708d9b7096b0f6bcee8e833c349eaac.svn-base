import { Assessment, Delete } from '@material-ui/icons'
import MaterialTable from 'material-table'
import React, { Component } from 'react'
import Header from '../../components/Header'
import MapViewModalPolygon from '../../components/MapViewModalPolygon'
import Menu from '../../components/Menu'
import PageContent from '../../components/PageContent'
import PageContentHeader from '../../components/PageContentHeader'
import { SwAlert, SwAlertToast } from '../../components/SweetAlert'
import { tableIcons, tableLocalization, tableOptions } from '../../config/material_table_config'
import AppConstant from '../../constant/app_constant'
import PageConstant from '../../constant/page_constant'
import { HttpRequest } from '../../services/services'
import { parse } from 'wellknown';

export default class DangerAreasView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        this.state = {
            isLoading: true,
            dangerAreas: [],
            isDialogOpen: false,
            selectedArea: []
        }

        this.getAllDangerAreas();
    }

    getAllDangerAreas = async () => {
        let response = await HttpRequest("", "/Areas/GetAllDangerAreas");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        response.map(item => {
            item.RecordDate = this.dateToString(item.RecordDate)
        })

        this.setState({
            dangerAreas: response
        })
    }

    onDeleteArea = async (e, areaInfo) => {
        const result = await SwAlert({ icon: "success", title: "Bölgeyi Sil", text: "Bölgeyi Silmek İstediğinizden Emin misiniz?" })
        if (result.isConfirmed) {
            this.setState({ isLoading: true });

            const data = {
                Id: areaInfo.Id
            }

            const response = await HttpRequest(data, "/Areas/DeleteDangerArea");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") {
                SwAlertToast({ icon: "error", title: "İşlem Sırasında Bir Hata Oluştu" });
                return;
            };

            if (response.IsSuccess) {
                SwAlertToast({ icon: "success", title: "Bölge Başarıyla Silindi" });
            } else {
                SwAlertToast({ icon: "error", title: "İşlem Sırasında Bir Hata Oluştu" });
            }

            this.setState({
                dangerAreas: this.state.dangerAreas.filter(item => item.Id != areaInfo.Id)
            })
        }
    }

    onShowAreaOnMap = (e, areaInfo) => {
        let coord = parse(areaInfo.Polygon).coordinates[0];
        let tmpCoord = [];
        coord.map(item => {
            tmpCoord.push([item[1], item[0]])
        })
        this.setState({
            selectedArea: tmpCoord,
            isDialogOpen: true
        })
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

    render() {
        const { isLoading, dangerAreas, isDialogOpen, selectedArea } = this.state;

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.DANGER_AREAS_VIEW} />
                <div className="content-wrapper pt-2">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">Tehlikeli Bölge Listesi</h1>
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
                                    tooltip: "Bölgeyi Sil",
                                    onClick: this.onDeleteArea
                                },
                                {
                                    icon: Assessment,
                                    tooltip: "Bölgeyi Gör",
                                    onClick: this.onShowAreaOnMap
                                }
                            ]}
                            columns={[
                                { title: "#", field: "Id" },
                                { title: "Başlık", field: "AreaTitle" },
                                { title: "Kayıt Tarihi", field: "RecordDate" },
                            ]}
                            data={dangerAreas}
                            title={"Tehlikeli Bölge Listesi"}
                        />
                    </PageContent>
                    <MapViewModalPolygon showDialog={isDialogOpen} dialogClose={this.dialogClose} info={selectedArea} />
                </div>
            </div>
        )
    }
}
