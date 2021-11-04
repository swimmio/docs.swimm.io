import React from 'react';
import styles from './YouTubePlayer.module.css';

export default function YouTubePlayer({id}) {
    var url = `https://www.youtube-nocookie.com/embed/${id}`;
    return (
        <div className={styles.videoEmbed}>
            <iframe  
                src={url}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                ></iframe>
        </div>
    );
}