import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
	constructor(props) {
     super(props);

     const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });
 
     this.state = {
       	album: album,
      	currentSong: album.songs[-1],
      	currentTime: 0,
      	duration: album.songs[0].duration,
      	isPlaying: false,
      	volume: 1,
      	mouseOverSong: ""
     };

     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;
   }

   componentDidMount() {
     this.eventListeners = {
       timeupdate: e => {
         this.setState({ currentTime: this.audioElement.currentTime });
       },
       durationchange: e => {
         this.setState({ duration: this.audioElement.duration });
       }
     };
     this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
   }

   componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }

   play(){
   	this.audioElement.play();
   	this.setState({ isPlaying: true });
   }

   pause(){
   	this.audioElement.pause();
   	this.setState({ isPlaying: false });
   }

   setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }

   handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }     
       this.play();
     }
   }

   handlePrevClick() {
   		const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      	const newIndex = Math.max(0, currentIndex - 1);
      	const newSong = this.state.album.songs[newIndex];
      	this.setSong(newSong);
      	this.play(newSong);
    }

    handleNextClick(){
    	const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    	const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex +1);
    	const newSong = this.state.album.songs[newIndex];
    	this.setSong(newSong);
    	this.play(newSong);
    }

    handleTimeChange(e) {
     const newTime = this.audioElement.duration * e.target.value;
     this.audioElement.currentTime = newTime;
     this.setState({ currentTime: newTime });
   }

   formatTime(timeInSeconds){
   	if(typeof(timeInSeconds) === "number"){
   		const minutes = Math.floor(timeInSeconds / 60).toString();
   		const seconds = Math.floor(timeInSeconds - minutes * 60).toString();
   		if(seconds < 10){
   			 return minutes + ":0" + seconds;
   		} else{
   			 return minutes + ":" + seconds;
   		}
   	} else {
   		return "-:--";
   		}
   	
   }

   handleVolumeChange(v){
   	this.audioElement.volume = v.target.value;
   	this.setState({ volume:this.audioElement.volume });
   }

   // ------------------ Assignment 10 -------------------------------

   handleOnMouseOver(e){
   	const currentMouseOverSong = this.state.album.songs[e.target.innerHTML-1];
   	console.log(currentMouseOverSong);
   	this.setState({ mouseOverSong:currentMouseOverSong });
   }

   handleOnMouseLeave(e){ 
   	this.setState({ mouseOverSong:"" });
   }

   handleSongClass(song){
   	if(this.state.currentSong===song && 
   		((this.state.isPlaying===false && this.state.mouseOverSong===song) ||
   		(this.state.isPlaying && this.state.mouseOverSong!==song))){
   		console.log("statement 1 executed");
   		return "ion-pause";
   	}
   	else if(this.state.currentSong===song &&
   		((this.state.isPlaying===false && this.state.mouseOverSong!==song) ||
   		(this.state.isPlaying && this.state.mouseOverSong===song))){
   		console.log("statement 2 executed");
   		return "ion-play";
   	}
   	else if(this.state.mouseOverSong===song){
   		console.log("statement 3 executed");
   		return "ion-play";
   	}
   	else {
   		console.log("statement 4 executed");
   		return null;
   	}
   }

   // ------------------ Assignment 10 -------------------------------

   render() {
     return (
       <section className="album">
         <section id="album-info">
           <img id="album-cover-art" src={this.state.album.albumCover} alt="album_cover_art"/>
           <div className="album-details">
             <h1 id="album-title">{this.state.album.title}</h1>
             <h2 className="artist">{this.state.album.artist}</h2>
             <div id="release-info">{this.state.album.year} {this.state.album.label}</div>
           </div>
         </section>
         <table id="song-list" align="center">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>  
           <tbody>
             {this.state.album.songs.map( (song, index) =>
               <tr className="song" key={index} onClick={ () => this.handleSongClick(song) } >
                 <td className="song-actions">
                   <button>
                     <span 
                     onMouseOver={(e) => this.handleOnMouseOver(e)} 
                     onMouseLeave={(e) => this.handleOnMouseLeave(e)}
                     className={this.handleSongClass(song)}>
                     	{this.state.mouseOverSong===song ? 
                     		null :
                     		this.state.currentSong!==song ?
                     			this.state.album.songs.indexOf(song) + 1 :
                     			null}
                     </span>
                   </button>
                 </td>
                 <td className="song-title">{song.title}</td>
                 <td className="song-duration">{song.duration}</td>
               </tr>
             )}
           </tbody>
         </table>
         <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.state.currentTime}
           duration={this.state.duration}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           formatTime = {(t) => this.formatTime(t)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
         />
       </section>
     );
   }
 }

export default Album;