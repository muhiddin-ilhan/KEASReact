import React, { Component } from 'react'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import PageContent from '../../components/PageContent';
import { Redirect } from 'react-router-dom';
import { tableIcons, tableLocalization, tableOptions } from '../../config/material_table_config';
import AppConstant from '../../constant/app_constant';
import PageConstant from '../../constant/page_constant'
import { HttpRequest } from '../../services/services';
import MaterialTable from 'material-table';

export default class FactoriesEntryView extends Component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem("user") === null || undefined) {
            window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);
            return;
        }
        const factory = props.location.state.factory
        this.state = {
            isLoading: true,
            factory: factory,
            data: []
        }

        this.getFactoryEntryTrucks(factory.Id);
    }

    getFactoryEntryTrucks = async (factoryId) => {
        const body = {
            "Id": factoryId
        }

        let response = await HttpRequest(body, "/FactoryEntry/GetFactoryEntriesByFactoryId");

        this.setState({ isLoading: false });

        if (response === "goLogin") window.location.assign(AppConstant.WEB_URL + PageConstant.LOGIN_PAGE_URL);

        if (response === "Error") return;

        if (!response.length) return;

        response.map(item => {
            let tmp = item.RemainingDistance;
            tmp = tmp / 1000;
            if (tmp.toString().length > 6) {
                tmp = tmp.toString().substring(0, 6)
            }
            item.RemainingDistance = tmp + " Km";

            item.Relation.DischargeDate = this.dateDifference(new Date(item.Relation.DischargeDate)) > 1000000 ? "-" : this.dateToString(new Date(item.Relation.DischargeDate))
        })

        this.setState({
            data: response
        })
    }

    dateDifference = (date) => {
        const time = new Date().getTime() - new Date(date).getTime();
        const minute = Math.floor(time / (1000 * 60));
        return minute;
    }

    dateToString = (date) => {
        let day = new Date(date).getDate();
        let month = new Date(date).getMonth();
        let year = new Date(date).getFullYear();
        let hour = new Date(date).getHours();
        let minute = new Date(date).getMinutes()
        if (hour.length === 1) {
            hour = "0" + hour;
        }
        if (minute.length === 1) {
            minute = "0" + minute;
        }
        return day + "/" + month + "/" + year + " " + hour + ":" + minute;
    }

    render() {
        const { isLoading, data } = this.state;

        return (
            <div>
                <Header />
                <Menu pageName={PageConstant.FACTORY_TASK_VİEW} />
                <div className="content-wrapper pt-3">
                    <PageContent>
                        <MaterialTable
                            isLoading={isLoading}
                            icons={tableIcons}
                            options={tableOptions}
                            localization={tableLocalization}
                            columns={[
                                { title: "Araç", field: "Truck.Plaque" },
                                { title: "Kimin Adına Getirdiği", field: "Task.ConsumerName" },
                                { title: "Şoför", field: "User.Name" },
                                { title: "Telefon", field: "User.Phone" },
                                { title: "Damper", field: "Truck.IsTipper", lookup: { 1: "Damperli", 0: "Dampersiz" } },
                                { title: "Boşaltım Yaptımı", field: "Relation.DischargeDate" },
                                { title: "Kalan Mesafe", field: "RemainingDistance" },
                            ]}
                            data={data}
                            title={"Yaklaşan Araçlar"}
                        />
                    </PageContent>
                </div>
            </div>
        )
    }
}
