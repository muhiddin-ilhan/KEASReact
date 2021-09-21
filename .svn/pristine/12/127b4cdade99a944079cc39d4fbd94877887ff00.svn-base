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

export default class UserAddView extends Component {
    constructor(props) {
        super(props);
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"))
        this.state = {
            roleCode: user.Role.RoleCode,
            all_roles: this.getAllRoles(),
            all_vendors: [],
            isLoading: false,
            name: "",
            surname: "",
            password: "",
            username: "",
            email: "",
            phone: "",
            role: "",
            vendor: ""
        }

        this.getAllVendors();
    }

    getAllRoles = () => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user.Role.RoleCode !== 4) {
            return [
                { "Id": 1, "Title": "Şoför" },
                { "Id": 2, "Title": "Web Yönetici" },
                { "Id": 3, "Title": "Güvenlik" },
                { "Id": 4, "Title": "Tedarikçi" }
            ]
        } else {
            return [
                { "Id": 1, "Title": "Şoför" }
            ]
        }

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

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    validateInputs = () => {
        const { name, surname, email, phone, role, vendor, password, username } = this.state;
        const user = JSON.parse(localStorage.getItem("user"))

        if (name === "" || name === null) return false;
        if (surname === "" || surname === null) return false;
        if (email === "" || email === null) return false;
        if (phone === "" || phone === null) return false;
        if (role === "-1" || role === null || role === "") return false;
        if (user.VendorId === 1) {
            if (vendor === "-1" || vendor === null || vendor === "") return false;
        }
        if (password === "" || password === null) return false;
        if (username === "" || username === null) return false;


        if (role === "4") {
            if (vendor === "1") return false;
        }

        return true;
    }

    onAddUser = async () => {
        const { name, surname, email, phone, role, vendor, password, username, roleCode } = this.state;

        if (this.validateInputs()) {
            const user = JSON.parse(localStorage.getItem("user"))
            this.setState({ isLoading: true });

            const body = {
                "Name": name,
                "SurName": surname,
                "Phone": phone,
                "RoleId": role,
                "Password": password,
                "EMail": email,
                "Identity": username,
                "VendorId": roleCode !== 4 ? vendor : user.VendorId
            };

            const response = await HttpRequest(body, "/Authentication/Register");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") return;

            SwAlertToast({ icon: 'success', title: 'İşlem Başarıyla Gerçekleşti' });
        } else {
            SwAlertToast({ icon: 'error', title: 'İşlem Sırasında Bir Hata Oluştu' });
        }
    }

    render() {
        const { isLoading, name, surname, email, phone, role, vendor, username, password, all_roles, all_vendors, roleCode } = this.state;
        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.USER_ADD_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">Kullanıcı Ekle</h1>
                    </PageContentHeader>

                    <PageContent>
                        <div class="card card-info">
                            <div className="card-body">
                                <FormColumn title="Ad" onChange={this.onChangeInput} value={name} name={"name"} />
                                <FormColumn title="Soyad" onChange={this.onChangeInput} value={surname} name={"surname"} />
                                <FormColumn title="Email" onChange={this.onChangeInput} value={email} name={"email"} />
                                <FormColumn title="Phone" onChange={this.onChangeInput} value={phone} name={"phone"} />
                                <FormColumn title="Kullanıcı Adı" onChange={this.onChangeInput} value={username} name={"username"} />
                                <FormColumn title="Şifre" onChange={this.onChangeInput} value={password} name={"password"} />
                                <FormColumnSelect title="Rol" onChange={this.onChangeInput} value={role} name={"role"} items={all_roles} />
                                {
                                    (roleCode !== 4) && <FormColumnSelect title="Tedarikçi" onChange={this.onChangeInput} value={vendor} name={"vendor"} items={all_vendors} />
                                }
                                <div className="form-group row">
                                    <div className="col-sm-12 mt-3">
                                        <button disabled={isLoading} onClick={this.onAddUser} class="btn btn-block btn-outline-success">
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
