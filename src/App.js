import React, { Component, useState, useEffect } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css"
import { getInitialFlightData } from "./DataProvider";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: getInitialFlightData()
    };

    this.columns = [
      {
        Header: "Origin",
        accessor: "origin"
      },
      {
        Header: "Flight",
        accessor: "flight"
      },
      {
        Header: "Arrival",
        accessor: "arrival"
      },
      {
        Header: "State",
        accessor: "state"
      }
    ];

  }

  componentDidMount() {
      this.eventSource = new EventSource("http://localhost:8080/api/v1/update-flight-info");
      this.eventSource.onmessage = e =>{
      console.log(e.data);
      this.updateFlightState(JSON.parse(e.data));
      }

    }

  updateFlightState(flightState) {
   let itemFound = 'N';
    let newData = this.state.data.map(item => {
    console.log('item.flight', item.flight);
    console.log('flightState.flight', flightState.flightNo);

    if (item.flight === flightState.flightNo) {
        item.state = flightState.state;
        itemFound = 'Y'
      }
      return item;
    });
    this.setState({ data: newData });
    if (itemFound === 'N'){
     let newFlight = {origin : flightState.origin, arrival:flightState.arrival, state:flightState.state,    flight: flightState.flightNo}
      console.log('newFlight', newFlight);
       this.setState({data: [...this.state.data, newFlight]});

    }

  }

  render() {
    return (
      <div className="App">
        <ReactTable data={this.state.data} columns={this.columns} />
      </div>
    );
  }
}

export default App;

