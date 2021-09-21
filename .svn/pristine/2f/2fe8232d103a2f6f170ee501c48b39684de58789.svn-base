import React, { Component } from 'react'
import ReactLoading from "react-loading";
import PageConstant from '../../constant/page_constant';
import { Redirect } from "react-router";
import { SwAlert, SwAlertToast } from '../../components/SweetAlert';
import { DoLogin } from '../../services/services';

export default class LoginView extends Component {
    state = {
        username: "",
        password: "",
        isLoading: false,
        redirect: ""
    }

    changeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    inputValidator = () => {
        const { username, password } = this.state;

        if (username === "" || password === "") {
            SwAlertToast({ icon: "error", title: "Lütfen Boş Alan Bırakmayınız" })
            return false;
        }
        if (username.includes(" ")) {
            SwAlertToast({ icon: "error", title: "Lütfen Geçerli Bir username Yazınız" })
            return false;
        }

        return true;
    }

    onLoginButtonClick = async () => {
        const { username, password } = this.state;

        if (!this.inputValidator()) return;

        this.setState({ isLoading: true });

        const response = await DoLogin(username, password, "/Authentication/Login");

        this.setState({ isLoading: false });
        if (response !== "Error") {
            if (response.Role.RoleCode === 3) {
                SwAlertToast({ icon: "success", title: "Başarıyla Giriş Yaptınız" })
                this.setState({
                    isLoading: false,
                    redirect: PageConstant.FACTORIES_PAGE_URL
                })
            }
            if (response.Role.RoleCode !== 1) {
                localStorage.setItem("user", JSON.stringify(response));
                SwAlertToast({ icon: "success", title: "Başarıyla Giriş Yaptınız" })
                this.setState({
                    isLoading: false,
                    redirect: PageConstant.MAIN_PAGE_URL
                })
            } else {
                SwAlertToast({ icon: "error", title: "Giriş Yapma Yetkiniz Yoktur" })
            }
        }
    }

    onRegisterButtonClick = () => {
        this.setState({
            redirect: PageConstant.REGISTER_PAGE_URL
        })
    }

    render() {
        const { username, password, isLoading, redirect } = this.state;

        if (redirect === PageConstant.MAIN_PAGE_URL) {
            return <Redirect to={PageConstant.MAIN_PAGE_URL} push={true} />;
        } else if (redirect === PageConstant.REGISTER_PAGE_URL) {
            return <Redirect to={PageConstant.REGISTER_PAGE_URL} push={true} />;
        } else if (redirect === PageConstant.FACTORIES_PAGE_URL) {
            return <Redirect to={PageConstant.FACTORIES_PAGE_URL} push={true} />;
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
                            <p className="login-box-msg">Oturumu Başlatmak İçin Giriş Yapın</p>
                            <form>
                                <div className="input-group mb-3">
                                    <input
                                        value={username}
                                        onChange={this.changeInput}
                                        onKeyPress={(event) => {
                                            if (event.key === "Enter") {
                                                this.onLoginButtonClick();
                                            }
                                        }}
                                        disabled={isLoading}
                                        name="username"
                                        type="text"
                                        className="form-control"
                                        placeholder="Kullanıcı Adı"
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        value={password}
                                        onChange={this.changeInput}
                                        onKeyPress={(event) => {
                                            if (event.key === "Enter") {
                                                this.onLoginButtonClick();
                                            }
                                        }}
                                        disabled={isLoading}
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
                                    <div className="col-6">
                                        <button type="button" onClick={this.onRegisterButtonClick} disabled={isLoading} className="btn btn-secondary btn-block d-flex justify-content-center">
                                            Kayıt Ol
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button type="button" onClick={this.onLoginButtonClick} disabled={isLoading} className="btn btn-primary btn-block d-flex justify-content-center">
                                            {isLoading ? <ReactLoading type={"spinningBubbles"} color={"#fff"} height={"15%"} width={"15%"} /> : "Giriş Yap"}
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

