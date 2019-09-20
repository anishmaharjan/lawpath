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
                <h1>Form AU</h1>
                <form ref={"auForm"}>
                    <label>
                        Postcode:
                        <input type="number" name="postcode" maxLength="4" minLength="4" required onChange={this.handleChange}/>
                    </label>
                    <label>
                        Suburb:
                        <input type="text" name="suburb" required onChange={this.handleChange}/>
                    </label>
                    <label>
                        State:
                        <input type="text" name="state" required onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Submit" onClick={this.handleSubmit}/>
                </form>
            </div>
        );
    }
}

export default App;
