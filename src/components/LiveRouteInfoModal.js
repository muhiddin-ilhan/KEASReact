import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default class LiveRouteInfoModal extends Component {
    dateToString = (date) => {
        return new Date(date).getDate() + " " + new Date(date).getMonthName() + " " + new Date(date).getFullYear() + " " + new Date(date).getHours() + ":" + new Date(date).getMinutes();
    }

    render() {
        var { showDialog, dialogClose, info } = this.props;
        return (
            <div>
                <Modal show={showDialog} onHide={dialogClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className="ml-2">{info.User.Name + " " + info.User.SurName}</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <table className="table table-hover">
                                <tbody>
                                    <tr>
                                        <th>{"Koordinatlar"}</th>
                                        <td>{info.Lat + ", "+info.Lon}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Hız"}</th>
                                        <td>{info.Speed + " km/s"}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Telefon"}</th>
                                        <td>{info.User.Phone}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Görev Başlığı"}</th>
                                        <td>{info.Task.TaskTitle}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Varış Fabrikası"}</th>
                                        <td>{info.Task.Factory.Title}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Araç"}</th>
                                        <td>{info.Truck.Brand+ " "+info.Truck.Model}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Plaka"}</th>
                                        <td>{info.Truck.Plaque}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Damper Durumu"}</th>
                                        <td>{info.Truck.IsTipper === 1? "Damperli":"Dampersiz"}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Son Görülme"}</th>
                                        <td>{this.dateToString(info.RecordDate)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={dialogClose}>
                            Kapat
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
