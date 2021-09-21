import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { PointIcon, WarehouseMarker } from '../config/react_leaflet_icons';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { isEmptyObject } from 'jquery';

export default class PhotoListModal extends Component {

    render() {
        var { showDialog, dialogClose, photos } = this.props;
        return (
            <div>
                <Modal show={showDialog} onHide={dialogClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className="ml-2">{"Lokasyon"}</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            {
                                photos !== null &&
                                photos.map((photo, index) =>
                                    <a href={photo} download>
                                        <div className="card bg-info d-flex" style={{ cursor: 'pointer' }} >
                                            <div className="card-header flex-grow-1"><i className="fas fa-download mr-3"></i>{"Fotoğraf " + index} </div>
                                        </div>
                                    </a>
                                )
                            }
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
