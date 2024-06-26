import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function MusicModal() {

    const [videoId, setVideoId] = useState('dmUGuJf-cgg')
    const [player, setPlayer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('')
    const [isPlayerReady, setIsPlayerReady] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false);

    const [currentSong, setCurrentSong] = useState({
        title: 'רביד פלוטניק - קפה וסיגריה (אודיו)',
        thumbnail: 'https://i.ytimg.com/vi/dmUGuJf-cgg/default.jpg',
    });

    useEffect(() => {
        if (window.YT && window.YT.Player) {
            createPlayer();
        } else {
            const tag = document.createElement('script')
            tag.src = 'https://www.youtube.com/iframe_api'
            const firstScriptTag = document.getElementsByTagName('script')[0]
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

            window.onYouTubeIframeAPIReady = createPlayer
        }
        return () => {
            window.onYouTubeIframeAPIReady = null
        }
    }, [])


    function createPlayer() {
        setPlayer(new window.YT.Player('videoPlayer', {
            height: '190',
            width: '140',
            videoId: videoId,
            playerVars: { 'autoplay': 0, 'controls': 1 },
            events: {
                onReady: onPlayerReady,
            },
        }))
    }

    function onPlayerReady(event) {
        setIsPlayerReady(true);
        event.target.cueVideoById(videoId)
    }


    function handleSearchChange(event) {
        setSearchTerm(event.target.value)
    }
    useEffect(() => {
        if (player && typeof player.cueVideoById === 'function') {
            player.cueVideoById(videoId)
        }
    }, [videoId])


    async function handleSearch(event) {
        event.preventDefault()

        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
            searchTerm
        )}&maxResults=1&key=${"AIzaSyB8ifuCghBu6hu0LH7X3lNjvmnt_TRQyhc"}`

        try {
            const response = await axios.get(searchUrl)
            if (response.data.items.length > 0) {
                const { id, snippet } = response.data.items[0]
                const newVideoId = id.videoId;
                setCurrentSong({
                    title: snippet.title,
                    thumbnail: snippet.thumbnails.default.url,
                });
                setVideoId(newVideoId);
            } else {
                console.error('No videos found')
            }
        } catch (error) {
            console.error('Error fetching data: ', error)
        }
    };

    function playVideo() {
        if (player && isPlayerReady) {
            player.playVideo()
            setIsPlaying(true)

        } else {
            console.error('Player is not ready')
        }
    };


    function pauseVideo() {
        player.pauseVideo()
        setIsPlaying(false)
    }

    function seekForward() {
        const currentTime = player.getCurrentTime()
        player.seekTo(currentTime + 10)

    }

    function seekBackward() {
        const currentTime = player.getCurrentTime()
        player.seekTo(currentTime - 10)

    }

    useEffect(() => {
        if (player && isPlayerReady) {
            player.cueVideoById(videoId)
        }
    }, [videoId, player, isPlayerReady])

    return (
        <div className="music-modal ios-modal">
            <div className="ios-modal-header">
                <div style={{ display: 'none' }} id="videoPlayer"></div>
                <span>Music Player</span>
            </div>
            <form style={{ width: '0px', margin: '0px' }} onSubmit={handleSearch} className="search-form">
                <input style={{ height: '30px' }} type="text" placeholder="Search for a song" value={searchTerm} onChange={handleSearchChange} />
                <button type="submit" className="search-music-input">Search</button>
            </form>
            <div className="current-song">
                <img src={currentSong.thumbnail} alt={currentSong.title} className="song-thumbnail" />
                <div className="song-info">
                    <p className="song-title">{currentSong.title}</p>
                </div>
            </div>
            <div className="player-controls">
                <button onClick={seekBackward} className="control-btn rewind">{reply}</button>
                {isPlaying
                    ? <button onClick={pauseVideo} className="control-btn pause">{pause}</button>
                    : <button onClick={playVideo} className="control-btn play">{play}</button>
                }
                <button onClick={seekForward} className="control-btn forward">{forward}</button>
            </div>
        </div>
    );

};


const play = <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
const pause = <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
const forward = <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M360-320v-180h-60v-60h120v240h-60Zm140 0q-17 0-28.5-11.5T460-360v-160q0-17 11.5-28.5T500-560h80q17 0 28.5 11.5T620-520v160q0 17-11.5 28.5T580-320h-80Zm20-60h40v-120h-40v120ZM480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800h6l-62-62 56-58 160 160-160 160-56-58 62-62h-6q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440h80q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z" /></svg>
const reply = <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80ZM360-320v-180h-60v-60h120v240h-60Zm140 0q-17 0-28.5-11.5T460-360v-160q0-17 11.5-28.5T500-560h80q17 0 28.5 11.5T620-520v160q0 17-11.5 28.5T580-320h-80Zm20-60h40v-120h-40v120Z" /></svg>