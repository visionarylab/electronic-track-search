import React, { Component } from 'react';
import styles from './App.module.scss';
import Search from './component/Search';
import ResultsContainer from './container/ResultsContainer';
import { scLinks } from './data/import-data';

class App extends Component {

  state = {
    searchArtist: '',
    searchTrack: '',
  }

  componentDidMount() {
    // fetch('https://electronic-search-api-keys.herokuapp.com/mykeys')
    //   .then(data => data.json())
    //   .then(jsonData => this.setState({keys:jsonData.results}))
    //   .catch(error => console.log(error))
  }

  handleChange = (event, state) => this.setState({[state]: event.target.value})

  // mixesDbTitles = data => data.map(el => el.link.slice(el.link.indexOf('/w/')+16).replace(/_/g, ' '));

  get searchTerm() {
    return this.state.searchArtist + ' ' + this.state.searchTrack;
  }

  search = (event) => {
    event.preventDefault();
    console.log('searching')

    fetch(`https://electronic-search-api-keys.herokuapp.com/discogsyoutubemixesdb?q=${this.searchTerm}`)
    .then(data => data.json())
    .then(jsonData => {
      this.setState({
        discogs: jsonData.discogs,
        youtube: jsonData.youtube,
        mixesdb: jsonData.mixesdb,
      })
      fetch(`https://electronic-search-api-keys.herokuapp.com/soundcloudsearches?q=` + JSON.stringify(jsonData.mixesdb))
        .then(data => data.json())
        .then(jsonData => this.setState({
          soundcloud: jsonData.soundcloud,
        }))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error));
  }


  get discogsData() {
    return this.state.discogs
  }

  get youtubeData() {
    return this.state.youtube
  }

  get soundcloudData() {
    return this.state.soundcloud ? this.state.soundcloud : scLinks;
  }

showSpinners = () => ['discogs', 'youtube', 'soundcloud'].forEach(state => this.setState({[state]: 'spinner'})); 

showResults = () => this.state.discogs ? <ResultsContainer discogs={this.discogsData} youtube={this.youtubeData} soundcloud={this.soundcloudData} /> : '';

  render() {
    console.log(this.state)
    return (
      <main className={styles.main}>
        <Search handleChange={this.handleChange} searchFunc={this.search} />
        {this.showResults()}
      </main>
    );
  }
}

export default App;
