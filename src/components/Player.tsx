import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import styles from '../styles/componentsStyles/player.module.scss'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import ConvertDutarionToString from '../utils/converteDurationToString';
export function Player() {
    const {
        currentEpisodeIndex,
        episodeList,
        isPlaying,
        togglePlay,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        setPlayingState,
        playPrevious,
        playNext,
        hasNext,
        hasPrevious,
        clearPlayerState
    } = useContext(PlayerContext);

    function setupProgressListiner() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        });
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    function handleSeek(value: number) {
        audioRef.current.currentTime = value
        setProgress(value)
    }
    const audioRef = useRef<HTMLAudioElement>(null)
    const episode = episodeList[currentEpisodeIndex];
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (!audioRef.current) {
            return
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])
    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora </strong>

            </header>
            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image src={episode.thumbnail}
                        width={592} height={592} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (<div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div>)}

            <footer className={!episode ? styles.empty : ""}>
                <div className={styles.progress}>
                    <span>{ConvertDutarionToString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />

                        ) :
                            (
                                <div className={styles.emptySlider} />
                            )}
                    </div>
                    <span>{ConvertDutarionToString(episode?.duration ?? 0)}</span>
                </div>
                {episode &&
                    (
                        <audio src={episode.url}
                            ref={audioRef}
                            autoPlay
                            onEnded={handleEpisodeEnded}
                            loop={isLooping}
                            onPlay={() => setPlayingState(true)}
                            onPause={() => setPlayingState(false)}
                            onLoadedMetadata={setupProgressListiner}
                        />
                    )
                }
                <div className={styles.butttons} >
                    <button
                        type="button"
                        onClick={toggleShuffle}
                        disabled={!episode || episodeList.length === 1}
                        className={isShuffling ? styles.isActive : ''}
                    >

                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button onClick={playPrevious} type="button" disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button type="button" disabled={!episode} onClick={togglePlay} className={styles.playButton}>
                        {isPlaying ?
                            (<img src="/pause.svg" alt="pausar" />)
                            : (<img src="/play.svg" alt="Tocar" />)}
                    </button>

                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar proximo" />
                    </button>
                    <button
                        onClick={toggleLoop}
                        type="button" disabled={!episode}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>


            </footer>

        </div>
    );
}