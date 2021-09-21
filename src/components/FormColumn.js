import React, { Component } from 'react'

export default class FormColumn extends Component {
    render() {
        const { title, onChange, value, name } = this.props;

        return (
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                    {title}
                </label>
                <div className="col-sm-10">
                    <input
                        value={value}
                        onChange={onChange}
                        disabled={name === "Null"}
                        type="text"
                        className="form-control"
                        name={name}
                    />
                </div>
            </div>
        )
    }
}
