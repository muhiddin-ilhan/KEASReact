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

export default class VendorsView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        this.state = {
            isLoading: true,
            redirect: "",
            vendors: [],
            clickedVendor: {}
        }

        this.getAllVendors();
    }

    getAllVendors = async () => {

        const response = await HttpRequest("", "/Vendor/GetAllVendors");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        this.setState({
            vendors: response
        })
    }

    goVendorEditPage = (e, vendorInfo) => {
        this.setState({
            clickedVendor: vendorInfo,
            redirect: PageConstant.VENDOR_EDIT_PAGE_URL
        })
    }

    onDeleteVendor = async (e, vendorInfo) => {
        const result = await SwAlert({ icon: "success", title: "Tedarikçiyi Sil", text: "Tedarikçiyi Silmek İstediğinizden Emin misiniz?" })
        if (result.isConfirmed) {
            this.setState({ isLoading: true });

            const data = {
                Id: vendorInfo.Id
            }

            const response = await HttpRequest(data, "/Vendor/DeleteVendor");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") {
                SwAlertToast({ icon: "error", title: "İşlem Sırasında Bir Hata Oluştu" });
                return;
            };

            if (response.IsSuccess) {
                SwAlertToast({ icon: "success", title: "Tedarikçi Başarıyla Silindi" });
            } else {
                SwAlertToast({ icon: "error", title: "İşlem Sırasında Bir Hata Oluştu" });
            }

            this.setState({
                vendors: this.state.vendors.filter(item => item.Id != vendorInfo.Id)
            })
        }
    }

    render() {
        const { isLoading, redirect, vendors, clickedVendor } = this.state;

        if (redirect === PageConstant.VENDOR_EDIT_PAGE_URL) {
            return <Redirect to={{ pathname: PageConstant.VENDOR_EDIT_PAGE_URL, state: { vendor: clickedVendor } }} push={true} />;
        }

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.VENDOR_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">Tedarikçi Listesi</h1>
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
                                    tooltip: "Tedarikçiyi Sil",
                                    onClick: this.onDeleteVendor
                                },
                                {
                                    icon: Edit,
                                    tooltip: "Güncelle",
                                    onClick: this.goVendorEditPage
                                }
                            ]}
                            columns={[
                                { title: "#", field: "Id" },
                                { title: "İsim", field: "Title" },
                                { title: "Kayıt Tarihi", field: "RecordDate" }
                            ]}
                            data={vendors}
                            title={"Tedarikçi Listesi"}
                        />
                    </PageContent>
                </div>
            </div>
        )
    }
}
