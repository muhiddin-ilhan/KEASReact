import React, { Component } from 'react'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageConstant from '../../constant/page_constant'
import PageContent from '../../components/PageContent'
import PageContentHeader from '../../components/PageContentHeader'
import MaterialTable from 'material-table'
import { tableIcons, tableLocalization, tableOptions } from '../../config/material_table_config'
import { Assessment, Delete } from '@material-ui/icons'
import { Redirect } from 'react-router-dom'
import { HttpRequest } from '../../services/services'
import AppConstant from '../../constant/app_constant'
import { SwAlert, SwAlertToast } from '../../components/SweetAlert'
import Edit from '@material-ui/icons/Edit'

export default class TrucksView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        this.state = {
            isLoading: true,
            redirect: "",
            trucks: [],
            clickedTruck: {}
        }

        this.getAllTrucks();
    }

    getAllTrucks = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        let body = ""
        if (user.VendorId !== 1) {
            body = {
                "VendorId": user.VendorId
            }
        }

        const response = await HttpRequest(body, "/Truck/GetAllTrucks");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        this.setState({
            trucks: response
        })
    }

    goTruckEditPage = (e, truckInfo) => {
        this.setState({
            clickedTruck: truckInfo,
            redirect: PageConstant.TRUCKS_EDIT_PAGE_URL
        })
    }

    onDeleteTruck = async (e, truckInfo) => {
        const result = await SwAlert({ icon: "success", title: "Arac?? Sil", text: "Arac?? Silmek ??stedi??inizden Emin misiniz?" })
        if (result.isConfirmed) {
            this.setState({ isLoading: true });

            const data = {
                Id: truckInfo.Id
            }

            const response = await HttpRequest(data, "/Truck/DeleteTruck");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
                return;
            };

            if (response.IsSuccess) {
                SwAlertToast({ icon: "success", title: "Ara?? Ba??ar??yla Silindi" });
            } else {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
            }

            this.setState({
                trucks: this.state.trucks.filter(item => item.Id != truckInfo.Id)
            })
        }
    }

    render() {
        const { isLoading, redirect, trucks, clickedTruck } = this.state;

        if (redirect === PageConstant.TRUCKS_EDIT_PAGE_URL) {
            return <Redirect to={{ pathname: PageConstant.TRUCKS_EDIT_PAGE_URL, state: { truck: clickedTruck } }} push={true} />;
        }

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.TRUCKS_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">Ara?? Listesi</h1>
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
                                    tooltip: "Arac?? Sil",
                                    onClick: this.onDeleteTruck
                                },
                                {
                                    icon: Edit,
                                    tooltip: "G??ncelle",
                                    onClick: this.goTruckEditPage
                                }
                            ]}
                            columns={[
                                { title: "#", field: "Id" },
                                { title: "Marka", field: "Brand" },
                                { title: "Model", field: "Model" },
                                { title: "Damper", field: "IsTipper", lookup: {"1":"Damperli", "0":"Dampersiz"} },
                                { title: "Plaka", field: "Plaque" },
                                { title: "Kime Ait", field: "Vendor.Title" },
                            ]}
                            data={trucks}
                            title={"Ara?? Listesi"}
                        />
                    </PageContent>
                </div>
            </div>
        )
    }
}
