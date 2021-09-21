import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default class AlertDialog extends Component {
    dateToString = (date) => {
        return new Date(date).getDate() + " " + new Date(date).getMonthName() + " " + new Date(date).getFullYear() + " " + new Date(date).getHours() + ":" + new Date(date).getMinutes();
    }

    render() {
        var { showDialog, dialogClose, item, shipment } = this.props;
        return (
            <div>
                <Modal show={showDialog} onHide={dialogClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className="ml-2">{shipment.Title}</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <table className="table table-hover">
                                <tbody>
                                    <tr>
                                        <th>{"Başlangıç Zamanı"}</th>
                                        <td>{item !== null ? this.dateToString(item.StartTime) : "00.00.00"}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Bitiş Zamanı"}</th>
                                        <td>{item !== null ? this.dateToString(item.FinishTime) : "00.00.00"}</td>
                                    </tr>
                                    <tr>
                                        <th>{"Ortalama Hız"}</th>
                                        <td>{item !== null ? item.AverageSpeed + " Kmh" : "00.00.00"}</td>
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
