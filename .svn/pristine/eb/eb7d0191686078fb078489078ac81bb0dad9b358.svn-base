import React, { Component } from 'react'
import woodIcon from '../assets/images/wood_marker.png';
import warehouseIcon from '../assets/images/warehouse_marker.png';
import personIcon from '../assets/images/1.png';
import routeIcon from '../assets/images/route.png';
import infoIcon from '../assets/images/info.png';

export default class CarListCard extends Component {
    state = {
        isMouseOver: 0,
    }

    dateToString = (date) => {
        const time = new Date().getTime() - new Date(date).getTime();
        const minute = Math.floor(time / (1000 * 60));
        return (minute + " DK")
    }

    dateDifference = (date) => {
        const time = new Date().getTime() - new Date(date).getTime();
        const minute = Math.floor(time / (1000 * 60));
        return minute;
    }

    render() {
        const { isMouseOver } = this.state;
        const { onTaskClick, isSelected, item, mapFlyTo, drawRoute, dialogOpen } = this.props;
        return (
            <>
                <div onClick={onTaskClick.bind(this, item)} style={{ cursor: 'pointer' }} className={"card pl-3 pr-3 pt-2 pb-2 m-2" + (isMouseOver === item.User.Id && isSelected !== item.User.Id ? " bg-light border-secondary" : "") + (isSelected === item.User.Id ? " bg-info" : "")} onMouseOver={() => this.setState({ isMouseOver: item.User.Id })} onMouseLeave={() => this.setState({ isMouseOver: 0 })}>
                    <span className="d-flex" style={{ position: 'relative', color: 'black', fontSize: 17, fontWeight: 500, height: 25 }}>
                        <p style={{ position: 'absolute', left: 0 }}><i className="fas fa-car mr-1" style={{ color: this.dateDifference(item.RecordDate) > 120 ? this.dateDifference(item.RecordDate) > 300 ? '#E42A2A' : '#FFA704' : 'green' }}></i>{item.Truck.Plaque + " " + item.User.Name}</p>
                        <p style={{ position: 'absolute', right: 0 }}><i className="fas fa-clock mr-1" style={{ color: this.dateDifference(item.RecordDate) > 120 ? this.dateDifference(item.RecordDate) > 300 ? '#E42A2A' : '#FFA704' : 'green' }}></i>{this.dateToString(item.RecordDate)}</p>
                    </span>
                </div>
                {
                    item.User.Id === isSelected ?
                        <div className="d-flex pl-2 pr-2 pt-0 pb-0">
                            <div onClick={() => { mapFlyTo(item.Task.Factory.Lat, item.Task.Factory.Lon) }} className="card pt-1 pb-2 mr-1 text-center flex-grow-1" style={{ height: 35, cursor: 'pointer' }}>
                                <span><img src={warehouseIcon} style={{ height: 20, width: 20 }} /></span>
                            </div>
                            <div onClick={() => { mapFlyTo(item.Task.GoodsLoadingAreaLat, item.Task.GoodsLoadingAreaLon) }} className="card pt-1 pb-2 mr-1 text-center flex-grow-1" style={{ height: 35, cursor: 'pointer' }}>
                                <span><img src={woodIcon} style={{ height: 24, width: 24 }} /></span>
                            </div>
                            <div onClick={() => { mapFlyTo(item.Lat, item.Lon) }} className="card pt-1 pb-2 mr-1 text-center flex-grow-1" style={{ height: 35, cursor: 'pointer' }}>
                                <span><img src={personIcon} style={{ height: 24, width: 24 }} /></span>
                            </div>
                            <div onClick={() => { drawRoute() }} className={"card pt-1 pb-2 mr-1 text-center flex-grow-1"} style={{ height: 35, cursor: 'pointer' }}>
                                <span><img src={routeIcon} style={{ height: 20, width: 20 }} /></span>
                            </div>
                            <div onClick={() => { dialogOpen() }} className="card pt-1 pb-2 text-center flex-grow-1" style={{ height: 35, cursor: 'pointer' }}>
                                <span><img src={infoIcon} style={{ height: 20, width: 20 }} /></span>
                            </div>
                        </div> : null
                }

            </>
        )
    }
}

Date.prototype.getMonthName = function () {
    var monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    return monthNames[this.getMonth()];
};

