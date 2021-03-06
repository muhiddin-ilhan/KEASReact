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

export default class VendorEditView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        
        const vendor = props.location.state.vendor;
        this.state = {
            vendor: vendor,
            isLoading: false,
            title: vendor.Title
        }
    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    validateInputs = () => {
        const { title } = this.state;

        if (title === "" || title === null) return false;

        return true;
    }

    onUpdateVendor = async () => {
        const { vendor, title } = this.state;

        if (this.validateInputs()) {
            this.setState({ isLoading: true });

            const body = {
                "Id": vendor.Id,
                "Title": title
            };

            const response = await HttpRequest(body, "/Vendor/UpdateVendor");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") return;

            SwAlertToast({ icon: 'success', title: 'İşlem Başarıyla Gerçekleşti' });
        }else{
            SwAlertToast({ icon: 'error', title: 'İşlem Sırasında Bir Hata Oluştu' });
        }
    }

    render() {
        const { isLoading, title } = this.state;
        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.VENDOR_EDIT_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">Tedarikçi Güncelle</h1>
                    </PageContentHeader>

                    <PageContent>
                        <div class="card card-info">
                            <div className="card-body">
                                <FormColumn title="İsim" onChange={this.onChangeInput} value={title} name={"title"} />
                                <div className="form-group row">
                                    <div className="col-sm-12 mt-3">
                                        <button disabled={isLoading} onClick={this.onUpdateVendor} class="btn btn-block btn-outline-success">
                                            {isLoading ? (
                                                <ReactLoading className={"ml-md-auto mr-md-auto"} type={"spinningBubbles"} color={"#000"} height={"1.5%"} width={"1.5%"} />
                                            ) : (
                                                "Güncelle"
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
