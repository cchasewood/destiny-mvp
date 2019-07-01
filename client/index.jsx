import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx'

let containedStyle = {
  position: 'fixed',
  marginLeft: '20%',
  overflow: 'scroll',
  width: '474px',
  backgroundColor: '#14191e',
  height: '100vh',
  zIndex: '5'
}
let containerStyle = {
  backgroundImage: 'url(https://www.bungie.net/img/theme/destiny/bgs/bg_companion_marketing_header_v2.jpg)',
  backgroundSize: 'cover no-repeat',
  minHeight: '100vh'
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      displayName: 'No Guardian Selected',
        level: 0,
        light: 0,
        emblemPath: null,
        emblemBackgroundPath: null,
        items: []
    }
    this.seedPage = this.seedPage.bind(this);
    this.findGuardian = this.findGuardian.bind(this);
    this.getItems = this.getItems.bind(this);
  }

  componentDidMount() {
    this.seedPage();
  }   

  findGuardian(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: `http://${window.location.hostname}:5252/search`,
      data: { displayName: $('#displayName').val() },
      success: (data) => {
        this.setState({
        displayName: data[0].displayName,
        level: data[0].level,
        light: data[0].light,
        emblemPath: data[0].emblemPath,
        emblemBackgroundPath: data[0].emblemBackgroundPath
      })
      }
    })
  }

  seedPage() {
    console.log('fetching Guardian data');
    fetch(`http://${window.location.hostname}:5252/seed`)
      .then(res =>  res.json())
      .then(data => this.setState({ 
          displayName: data[0].displayName,
          level: data[0].level,
          light: data[0].light,
          emblemPath: data[0].emblemPath,
          emblemBackgroundPath: data[0].emblemBackgroundPath
      }))
      .then(() => this.getItems());
  }

  getItems() {
    console.log('fetching Guardian items');
    $.ajax({
      method: 'POST',
      url: `http://${window.location.hostname}:5252/items`,
      data: { displayName: this.state.displayName },
      success: (data) => this.setState({ items: data })
    }) 
  }

  render () {
    let emblemStyle = {
      backgroundImage: `url(https://www.bungie.net${this.state.emblemBackgroundPath})`,
      height: '96px'
    }
    return (
      <div style={containerStyle} className='container d-flex flex-column h-100 bg'>
        <div style={containedStyle} className='scrollable container col-lg-4 text-light'>
          <Search findGuardian={this.findGuardian} />
          <div style={emblemStyle} className='bg'></div>
          <h1>Viewing: {this.state.displayName}</h1>
          <h3>Level: {this.state.level}</h3>
          <h3>Light: {this.state.light}</h3>
          <button onClick={this.getItems}>Get Items</button>
          {this.state.items.map((item,i) => {
            return (
              <div key={i}>
              <div style={{ backgroundImage: `url(https://www.bungie.net${item.displayProperties.icon})`, height: '96px', width: '96px' }} />
              <h3>{item.displayProperties.name}</h3>
              <h5>{item.displayProperties.description}</h5>
              <a href={`https://www.bungie.net${item.screenshot}`}>View Item</a>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));