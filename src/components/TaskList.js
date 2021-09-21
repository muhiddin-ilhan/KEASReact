import React, { Component } from 'react'
import woodIcon from '../assets/images/wood_marker.png';
import warehouseIcon from '../assets/images/warehouse_marker.png';
import info from '../assets/images/info.png';

export default class TaskList extends Component {
    state = {
        isMouseOver: 0,
    }

    render() {
        const { isMouseOver } = this.state;
        const { onTaskClick, isSelected, item, mapFlyTo, dialogOpen, onDeleteShipment } = this.props;

        return (
            <>
                <div onClick={onTaskClick.bind(this, item)} style={{ cursor: 'pointer' }} className={"card pl-3 pr-3 pt-2 pb-2 " + (isMouseOver === item.Id && isSelected !== item.Id ? " bg-light border-secondary" : "") + (isSelected === item.Id ? " bg-warning" : "")} onMouseOver={() => this.setState({ isMouseOver: item.Id })} onMouseLeave={() => this.setState({ isMouseOver: 0 })}>
                    <span style={{ color: 'black', fontSize: 18, fontWeight: 500 }} >{item.Title}</span>
                    <span style={{ color: 'black', fontSize: 16, fontWeight: 400 }} className="mb-2">{item.Description}</span>

                    <div className="d-flex justify-content-between">
                        <div>
                            <i style={{ color: 'grey' }} className="fas fa-truck mr-1"></i>
                            <span style={{ color: 'grey', fontSize: 16, fontWeight: 400 }}>{item.TaskDate}</span>
                        </div>
                        <div>
                            <i style={{ color: 'grey' }} className="fas fa-home mr-1"></i>
                            <span style={{ color: 'grey', fontSize: 16, fontWeight: 400 }}>{item.DeliveryDate}</span>
                        </div>
                    </div>
                </div>
                {
                    isSelected === item.Id ?
                        <div className="card pl-3 pr-3 pt-2 pb-2 bg-light border-secondary">
                            <button className="btn btn-light" onClick={() => { mapFlyTo(item.TaskLat, item.TaskLon, 0) }}> <img src={woodIcon} width={25} /> Hedef Noktasını Gör </button>
                            <button className="btn btn-light" onClick={() => { mapFlyTo(item.TargetLat, item.TargetLon, 0) }}><img src={warehouseIcon} width={25} /> Depo Noktasını Gör</button>
                            {
                                item.ShipmentState === 1 ? <button className="btn btn-light" onClick={() => { dialogOpen() }}><img src={info} width={25} /> Teslimat Bilgilerini Gör</button> : null
                            }
                            <button className="btn btn-light" onClick={() => { onDeleteShipment(item) }}><i className="fas fa-trash" /> Görevi Sil</button>
                        </div> : null
                }
            </>
        )
    }
}
