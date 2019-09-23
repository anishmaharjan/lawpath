import React from 'react';
import './style.css';
import Request from './Service/api'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class App extends React.Component {

    /**
    * Initializing states
    */
    constructor(props) {
        super(props);
        this.state = {
            postcode: '',
            suburb: '',
            state: ''
        }
    }

    /**
    * Notification module
    */
    notify = (type) => {
      switch (type) {
        case 'success':
          NotificationManager.success('Success', 'The postcode, suburb and state entered are valid');
          break;
        case 'suburb':
          NotificationManager.warning('Not valid', `The postcode '${this.state.postcode}' does not match suburb '${this.state.suburb}'`, 5000);
          break;
        case 'state':
          NotificationManager.warning('Not valid', `The suburb '${this.state.suburb}' does not exist in state '${this.state.state}'`, 5000);
          break;
        case 'apiError':
          NotificationManager.error('Error', 'Failed to retrieve data from AUPOST', 5000);
          break;
        default:
      }
    };

    /**
    * Function that sets the value from form elements to state
    */
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    /**
    * Function that handles submit action
    */
    handleSubmit = (event) => {
        let validationFlag = false;
        let matchFlag = '';

        /**
        * Runs HTML5 validation in the forms
        */
        if (!this.refs.auForm.checkValidity()) return;

        event.preventDefault();

        //Api call to AUPOST
        Request.get(`points/postcode/${this.state.postcode}`)
            .then(response => {
                if (response.status === 200) {
                    response.data.points.map(point => {
                        if (point.address.suburb.toLowerCase() === this.state.suburb.toLowerCase()) {
                            if (point.address.state.toLowerCase() === this.state.state.toLowerCase()) {
                                validationFlag = true;
                            } else {
                                matchFlag = 'state';
                            }
                        } else{
                            matchFlag = 'suburb';
                        }
                        
                        return true;
                    });

                } else {
                    throw new Error({
                        status: response.status,
                        message: response.statusText
                    })
                }
            })
            .catch(error => {
                this.notify('apiError')
            })
            .finally(() => {
                if (!validationFlag) {
                    this.notify(matchFlag)
                } else {
                    this.notify("success");

                }
            })
    };

    

    render() {
        return (
            <div className="container">
            <div>
            <h3>Address Check Form</h3>
            </div>
                <div className="form-style">
                    <form ref={"auForm"} >
                        <div className="input-group">
                            <label>
                                Postcode: 
                                <input type="number" name="postcode" max="9999" min="0" required onChange={this.handleChange} placeholder="eg. 2145 or 2111"/>
                            </label>
                        </div>
                        <div className="input-group">
                            <label>
                                Suburb: 
                                <input type="text" name="suburb" required onChange={this.handleChange} placeholder="eg. Strathfield"/>
                            </label>
                        </div>
                        <div className="input-group">
                            <label>
                                State: <small>( Abbreviation only)</small>
                                <input type="text" name="state" required onChange={this.handleChange} maxLength="3"    pattern="[a-zA-Z]{2,3}" placeholder="eg. WA or NSW"/>
                            </label>
                        </div>
                        <div className="input-group">
                            <button onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </form>
                </div>
                <div>

                </div>
                <NotificationContainer/>
            </div>
        );
    }
}

export default App;
