import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      displayName: 'No Guardian Selected',
        level: 0,
        light: 0,
        emblemPath: null,
        emblemBackgroundPath: null
    }
    this.getInfo = this.getInfo.bind(this);
    this.findGuardian = this.findGuardian.bind(this);
  }

  componentDidMount() {
    this.getInfo();
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

  getInfo() {
    console.log('fetching Guardian data');
    fetch(`http://${window.location.hostname}:5252/seed`)
      .then(res => {
        return res.json()
      })
      .then(data => {
        this.setState({ 
          displayName: data[0].displayName,
          level: data[0].level,
          light: data[0].light,
          emblemPath: data[0].emblemPath,
          emblemBackgroundPath: data[0].emblemBackgroundPath
        })
      })
  }

  render () {
    let containedStyle = {
      display: 'inline-block',
      width: '474px',
      height: '100%',
      backgroundColor: 'rgb(83, 85, 89)'
    }
    let containerStyle = {
      textAlign: 'center',
      width: '100vw',
      height: '200vh',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100%',
      backgroundImage: 'url(https://www.bungie.net/img/theme/destiny/bgs/bg_companion_marketing_header_v2.jpg)'
    }

    let emblemStyle = {
      backgroundImage: `url(https://www.bungie.net${this.state.emblemBackgroundPath})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      width: '100%',
      height: '96px'
    };
    return (
      <div style={containerStyle}>
        <Search findGuardian={this.findGuardian}/>
        <div style={containedStyle}>
          <div style={emblemStyle}></div>
          <h1>Viewing: {this.state.displayName}</h1>
          <h3>Level: {this.state.level}</h3>
          <h3>Light: {this.state.light}</h3>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));