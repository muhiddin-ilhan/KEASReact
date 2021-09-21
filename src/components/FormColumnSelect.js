import React, { Component } from 'react'

export default class FormColumnSelect extends Component {
    render() {
        const { title, onChange, value, name, items, text } = this.props;

        return (
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                    {title}
                </label>
                <div className="col-sm-10">
                    <select value={value} onChange={onChange} class="form-control" name={name}>
                        <option value="-1">{"Seçim Yapınız"}</option>
                        {items.map((item) => (
                            <option value={item.Id}>{item.Title}</option>
                        ))}
                    </select>
                </div>
            </div>
        )
    }
}
