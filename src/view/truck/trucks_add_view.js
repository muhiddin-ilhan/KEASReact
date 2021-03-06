import React, { Component } from 'react'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageContent from '../../components/PageContent'
import PageContentHeader from '../../components/PageContentHeader'
import PageConstant from '../../constant/page_constant'
import ReactLoading from "react-loading";
import FormColumn from '../../components/FormColumn'
import FormColumnSelect from '../../components/FormColumnSelect'
import { HttpRequest } from '../../services/services'
import AppConstant from '../../constant/app_constant'
import { SwAlertToast } from '../../components/SweetAlert'

export default class TrucksAddView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        const user = JSON.parse(localStorage.getItem("user"))
        this.state = {
            userLocal: user,
            all_vendors: [],
            damper_option: this.getDamperOptions(),
            isLoading: false,
            brand: "",
            model: "",
            is_tipper: "",
            plaque: "",
            vendor: ""
        }

        this.getAllVendors();
    }

    getAllVendors = async () => {
        let response = await HttpRequest("", "/Vendor/GetAllVendors");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        this.setState({
            all_vendors: response
        })
    }

    getDamperOptions = () => {
        return [{ "Id": 1, "Title": "Damperli" }, { "Id": 0, "Title": "Dampersiz" }]
    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    validateInputs = () => {
        const { brand, model, is_tipper, plaque, vendor, userLocal } = this.state;

        if (brand === "" || brand === null) return false;
        if (model === "" || model === null) return false;
        if (is_tipper === "-1" || is_tipper === "null" || is_tipper === "") return false;
        if (plaque === "" || plaque === null) return false;
        if (userLocal.Role.RoleCode !== 4) {
            if (vendor === -1 || vendor === null || vendor === "") return false;
        }

        return true;
    }

    onInsertTruck = async () => {
        const { truck, brand, model, is_tipper, plaque, vendor, userLocal } = this.state;

        if (this.validateInputs()) {
            this.setState({ isLoading: true });

            const body = {
                "Brand": brand,
                "Model": model,
                "IsTipper": is_tipper,
                "Plaque": plaque,
                "VendorId": userLocal.Role.RoleCode !== 4 ? vendor : userLocal.VendorId
            };

            const response = await HttpRequest(body, "/Truck/InsertTruck");

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
        const { all_vendors, isLoading, brand, model, is_tipper, plaque, vendor, damper_option, userLocal } = this.state;
        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.TRUCKS_ADD_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">Ara?? Ekle</h1>
                    </PageContentHeader>

                    <PageContent>
                        <div class="card card-info">
                            <div className="card-body">
                                <FormColumn title="Marka" onChange={this.onChangeInput} value={brand} name={"brand"} />
                                <FormColumn title="Model" onChange={this.onChangeInput} value={model} name={"model"} />
                                <FormColumn title="Plaka" onChange={this.onChangeInput} value={plaque} name={"plaque"} />
                                <FormColumnSelect title="Damper" onChange={this.onChangeInput} value={is_tipper} name={"is_tipper"} items={damper_option} />
                                {
                                    userLocal.Role.RoleCode !== 4 && <FormColumnSelect title="Tedarik??i" onChange={this.onChangeInput} value={vendor} name={"vendor"} items={all_vendors} />
                                }
                                <div className="form-group row">
                                    <div className="col-sm-12 mt-3">
                                        <button disabled={isLoading} onClick={this.onInsertTruck} class="btn btn-block btn-outline-success">
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
