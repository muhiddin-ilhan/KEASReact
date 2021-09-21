import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { PointIcon, WarehouseMarker } from '../config/react_leaflet_icons';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { isEmptyObject } from 'jquery';

export default class MapViewModal extends Component {

    render() {
        var { showDialog, dialogClose, info } = this.props;
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
                            <MapContainer style={{ height: 400, width: '100%' }} center={[39.90, 32.85]} zoom={9} scrollWheelZoom={true}
                                whenReady={(map) => {
                                    this.setState({ map })
                                    map.target.flyTo([info.Lat, info.Lon], 14)
                                }}>
                                <TileLayer
                                    attribution=''
                                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                />
                                {
                                    !isEmptyObject(info) ? <Marker icon={PointIcon} key={"marker"} position={[info.Lat, info.Lon]}>
                                        <Tooltip permanent={true} direction="top">
                                            {info.Tooltip}
                                        </Tooltip>
                                    </Marker> : null
                                }

                                )
                            </MapContainer>
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
