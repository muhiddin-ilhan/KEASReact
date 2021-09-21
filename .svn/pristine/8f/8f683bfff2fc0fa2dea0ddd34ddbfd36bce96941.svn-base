import React, { Component } from 'react'
import woodIcon from '../assets/images/wood_marker.png';
import warehouseIcon from '../assets/images/warehouse_marker.png';
import personIcon from '../assets/images/person_marker.png';

export default class LastRouteCardList extends Component {
    state = {
        isMouseOver: 0,
    }

    dateToString = (date) => {
        const time = new Date().getTime() - new Date(date).getTime();
        const minute = Math.floor(time / (1000 * 60));
        return (minute + " DK Önce")
    }

    render() {
        const { isMouseOver } = this.state;
        const { onTaskClick, isSelected, item, mapFlyTo } = this.props;

        return (
            <>
                <div onClick={onTaskClick.bind(this, item)} style={{ cursor: 'pointer' }} className={"card pl-3 pr-3 pt-2 pb-2 " + (isMouseOver === item.Id && isSelected !== item.Id ? " bg-light border-secondary" : "") + (isSelected === item.Id ? " bg-info" : "")} onMouseOver={() => this.setState({ isMouseOver: item.Id })} onMouseLeave={() => this.setState({ isMouseOver: 0 })}>
                    <span style={{ color: 'black', fontSize: 18, fontWeight: 500 }} >{item.User.Name + " " + item.User.SurName}</span>
                    <span style={{ color: 'black', fontSize: 16, fontWeight: 400 }} className="mb-2">{item.Shipment.Title}</span>

                    <div className="d-flex justify-content-between">
                        <div>
                            <i style={{ color: 'grey' }} className="fas fa-truck mr-1"></i>
                            <span style={{ color: 'grey', fontSize: 16, fontWeight: 400 }}>{this.dateToString(item.RecordDate)}</span>
                        </div>
                        <div>
                            <span style={{ color: item.Shipment.ShipmentState === 0 ? 'red' : 'green', fontSize: 16, fontWeight: 400 }}>{item.Shipment.ShipmentState === 0 ? "Görev Yapılmadı" : "Görev Yapıldı"}</span>
                        </div>
                    </div>
                </div>
                {
                    isSelected === item.Id ?
                        <div className="card pl-3 pr-3 pt-2 pb-2 bg-light border-secondary">
                            <button className="btn btn-light" onClick={() => { mapFlyTo(item.Shipment.TaskLat, item.Shipment.TaskLon, 0) }}> <img src={woodIcon} width={25} /> Hedef Noktasını Gör </button>
                            <button className="btn btn-light" onClick={() => { mapFlyTo(item.Shipment.TargetLat, item.Shipment.TargetLon, 0) }}><img src={warehouseIcon} width={25} /> Depo Noktasını Gör</button>
                            <button className="btn btn-light" onClick={() => { mapFlyTo(item.Lat, item.Lon, 0) }}><img src={personIcon} width={25} /> Aracın Son Konumunu Gör</button>
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

