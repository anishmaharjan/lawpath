import React from 'react';
// import './App.css';
import './style.css';
import Request from './Service/api'
import {NotificationContainer, NotificationManager} from 'react-notifications';

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
                    console.log("Validation error")
                    this.notify('info')
                } else {
                    console.log("Successfully found")
                    this.notify("success")

                }
            })
    };

    notify = (type) => {
        return () => {
          switch (type) {
            case 'info':
              NotificationManager.info('Info message');
              break;
            case 'success':
              NotificationManager.success('Success message', 'Title here');
              break;
            case 'warning':
              NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
              break;
            case 'error':
              NotificationManager.error('Error message', 'Click me!', 5000, () => {
                alert('callback');
              });
              break;
          }
      }
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
            </div>
        );
    }
}

export default App;
