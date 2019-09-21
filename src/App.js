import React from 'react';
import './App.css';
import Request from './Service/api'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postcode: '',
            suburb: '',
            state: ''
        }
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = (event) => {
        let validationFlag = false;

        if (!this.refs.auForm.checkValidity()) return;

        event.preventDefault();

        //Api call
        Request.get(`points/postcode/${this.state.postcode}`)
            .then(response => {
                if (response.status === 200) {
                    response.data.points.map(point => {
                        if (point.address.suburb.toLowerCase() === this.state.suburb.toLowerCase()) {
                            if (point.address.state.toLowerCase() === this.state.state.toLowerCase()) {
                                validationFlag = true;
                            }
                        }

                    });

                } else {
                    throw new Error({
                        status: response.status,
                        message: response.statusText
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                if (!validationFlag) {
                    console.log("error")
                } else {
                    console.log("Successfully found")

                }
            })
    };

    render() {
        return (
            <div>
                <div className="container">
                    <div className="screen">
                        <div className="screen-header">
                            <div className="screen-header-left">
                                <div className="screen-header-button close"></div>
                                <div className="screen-header-button maximize"></div>
                                <div className="screen-header-button minimize"></div>
                            </div>
                            <div className="screen-header-right">
                                <div className="screen-header-ellipsis"></div>
                                <div className="screen-header-ellipsis"></div>
                                <div className="screen-header-ellipsis"></div>
                            </div>
                        </div>
                        <div className="screen-body">
                            <div className="screen-body-item left">
                                <div className="app-title">
                                    <span>Lawpath</span>
                                </div>
                                <div className="app-contact">SUBMITTED BY: A</div>
                            </div>
                            <div className="screen-body-item">
                                <div className="app-form">
                                    <form ref={"auForm"} className="background">
                                        <div className="app-form-group">
                                            <label>
                                                Postcode:
                                                <input className="app-form-control" type="number" name="postcode" max="9999" min="0" pattern="\d{4}" required onChange={this.handleChange}/>
                                            </label>
                                        </div>
                                        <div className="app-form-group">
                                            <label>
                                                Suburb:
                                                <input className="app-form-control" type="text" name="suburb" required onChange={this.handleChange}/>
                                            </label>
                                        </div>
                                        <div className="app-form-group">
                                            <label>
                                                State:
                                                <input className="app-form-control" type="text" name="state" required onChange={this.handleChange}/>
                                            </label>
                                        </div>
                                        <div className="app-form-group buttons">
                                            <button className="app-form-button" onClick={this.handleSubmit}>Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
