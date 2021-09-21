import React, { Component } from 'react';
import ReactLoading from "react-loading";
import { Redirect } from 'react-router-dom';
import { SwAlertToast } from '../../components/SweetAlert';
import PageConstant from '../../constant/page_constant';
import { DoRegister } from '../../services/services';


export default class RegisterView extends Component {
    state = {
        name: "",
        surname: "",
        identity: "",
        password: "",
        redirect: "",
        isLoading: false,
    };

    changeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    inputValidator = () => {
        const { identity, password, name, surname } = this.state;

        if (identity === "" || password === "" || name === "" || surname === "") {
            SwAlertToast({ icon: "error", title: "Lütfen Boş Alan Bırakmayınız" })
            return false;
        }
        if (identity.includes(" ")) {
            SwAlertToast({ icon: "error", title: "Lütfen Geçerli Bir Email Yazınız" })
            return false;
        }

        return true;
    }

    onRegister = async () => {
        const { identity, password, name, surname } = this.state;

        if (!this.inputValidator()) return;

        this.setState({ isLoading: true });

        const response = await DoRegister(name, surname, identity, password);

        this.setState({ isLoading: false });
        if (response !== "Error") {
            this.setState({
                isLoading: false,
                redirect: PageConstant.LOGIN_PAGE_URL
            })
        }
    }

    render() {
        const { name, surname, identity, password, isLoading, redirect } = this.state;

        if (redirect === PageConstant.LOGIN_PAGE_URL) {
            return <Redirect to={PageConstant.LOGIN_PAGE_URL} push={true} />;
        }

        return (
            <div class="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <div>
                            <b>KE</b>AS
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body login-card-body">
                            <p className="login-box-msg">Giriş Yapabilmek İçin Kayıt Olun</p>
                            <form>
                                <div className="input-group mb-3">
                                    <input
                                        value={name}
                                        onChange={this.changeInput}
                                        name="name"
                                        type="text"
                                        className="form-control"
                                        placeholder="İsim"
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        value={surname}
                                        onChange={this.changeInput}
                                        name="surname"
                                        type="text"
                                        className="form-control"
                                        placeholder="Soyisim"
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        value={identity}
                                        onChange={this.changeInput}
                                        name="identity"
                                        type="text"
                                        className="form-control"
                                        placeholder="Kullanıcı Adı"
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        value={password}
                                        onChange={this.changeInput}
                                        onKeyPress={(event) => {
                                            if (event.key === "Enter") {
                                                //Bişeyler Gelir
                                            }
                                        }}
                                        name="password"
                                        type="password"
                                        className="form-control"
                                        placeholder="Şifre"
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <button disabled={isLoading} onClick={this.onRegister} type="button" className="btn btn-success btn-block d-flex justify-content-center">
                                            {isLoading ? <ReactLoading type={"spinningBubbles"} color={"#fff"} height={"5%"} width={"5%"} /> : "Kayıt Ol"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
