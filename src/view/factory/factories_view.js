import React, { Component } from 'react'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageConstant from '../../constant/page_constant'
import PageContent from '../../components/PageContent'
import PageContentHeader from '../../components/PageContentHeader'
import MaterialTable from 'material-table'
import { tableIcons, tableLocalization, tableOptions } from '../../config/material_table_config'
import { Assessment, Delete, ShoppingCart } from '@material-ui/icons'
import { Redirect } from 'react-router-dom'
import { HttpRequest } from '../../services/services'
import AppConstant from '../../constant/app_constant'
import { SwAlert, SwAlertToast } from '../../components/SweetAlert'
import Edit from '@material-ui/icons/Edit'

export default class FactoriesView extends Component {
    constructor(props) {
        super(props);

        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        const userLocal = JSON.parse(localStorage.getItem("user"))

        this.state = {
            isLoading: true,
            redirect: "",
            factories: [],
            clickedFactory: {},
            userLocal: userLocal
        }

        this.getAllFactories();
    }

    getAllFactories = async () => {

        const response = await HttpRequest("", "/Factories/GetAllFactories");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        this.setState({
            factories: response
        })
    }

    goFactoryEditPage = (e, factoryInfo) => {
        this.setState({
            clickedFactory: factoryInfo,
            redirect: PageConstant.FACTORY_EDIT_PAGE_URL
        })
    }

    goFactoryTaskPage = (e, factoryInfo) => {
        this.setState({
            clickedFactory: factoryInfo,
            redirect: PageConstant.FACTORY_TASK_V??EW
        })
    }

    goFactoryEntryPage = (e, factoryInfo) => {
        this.setState({
            clickedFactory: factoryInfo,
            redirect: PageConstant.FACTORY_ENTRY_V??EW
        })
    }

    onDeleteFactory = async (e, factoryInfo) => {
        const result = await SwAlert({ icon: "success", title: "Fabrikay?? Sil", text: "Fabrikay?? Silmek ??stedi??inizden Emin misiniz?" })
        if (result.isConfirmed) {
            this.setState({ isLoading: true });

            const data = {
                Id: factoryInfo.Id
            }

            const response = await HttpRequest(data, "/Factories/DeleteFactory");

            this.setState({ isLoading: false });

            if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

            if (response === "Error") {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
                return;
            };

            if (response.IsSuccess) {
                SwAlertToast({ icon: "success", title: "Fabrika Ba??ar??yla Silindi" });
            } else {
                SwAlertToast({ icon: "error", title: "????lem S??ras??nda Bir Hata Olu??tu" });
            }

            this.setState({
                factories: this.state.factories.filter(item => item.Id != factoryInfo.Id)
            })
        }
    }

    render() {
        const { isLoading, redirect, factories, clickedFactory, userLocal } = this.state;

        if (redirect === PageConstant.FACTORY_EDIT_PAGE_URL) {
            return <Redirect to={{ pathname: PageConstant.FACTORY_EDIT_PAGE_URL, state: { factory: clickedFactory } }} push={true} />;
        } else if (redirect === PageConstant.FACTORY_TASK_V??EW) {
            return <Redirect to={{ pathname: PageConstant.FACTORY_TASK_V??EW, state: { factory: clickedFactory } }} push={true} />;
        } else if (redirect === PageConstant.FACTORY_ENTRY_V??EW) {
            return <Redirect to={{ pathname: PageConstant.FACTORY_ENTRY_V??EW, state: { factory: clickedFactory } }} push={true} />;
        }

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.FACTORIES_PAGE_URL} />
                <div className="content-wrapper">
                    <PageContentHeader>
                        <h1 className="m-0 text-dark">Fabrika Listesi</h1>
                    </PageContentHeader>

                    <PageContent>
                        <MaterialTable
                            isLoading={isLoading}
                            icons={tableIcons}
                            options={tableOptions}
                            localization={tableLocalization}
                            actions={[
                                userLocal.Role.RoleCode !== 3 && {
                                    icon: Delete,
                                    tooltip: "Fabrika Sil",
                                    onClick: this.onDeleteFactory
                                },
                                userLocal.Role.RoleCode !== 3 && {
                                    icon: Edit,
                                    tooltip: "G??ncelle",
                                    onClick: this.goFactoryEditPage
                                },
                                userLocal.Role.RoleCode !== 3 && {
                                    icon: Assessment,
                                    tooltip: "G??rev G??r",
                                    onClick: this.goFactoryTaskPage
                                },
                                {
                                    icon: ShoppingCart,
                                    tooltip: "Yakla??anlar?? G??r",
                                    onClick: this.goFactoryEntryPage
                                }
                            ]}
                            columns={[
                                { title: "#", field: "Id" },
                                { title: "??sim", field: "Title" },
                                { title: "Adres", field: "Address" }
                            ]}
                            data={factories}
                            title={"Fabrika Listesi"}
                        />
                    </PageContent>
                </div>
            </div>
        )
    }
}
