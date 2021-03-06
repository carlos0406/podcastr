import { GetStaticProps } from 'next';
import ptBR from 'date-fns/locale/pt-BR'
import Image from "next/image"
import Link from "next/link"
import { format, parseISO } from 'date-fns'
import { api } from '../services/api';
import ConvertDutarionToString from '../utils/converteDurationToString';
import styles from '../styles/pagesStyles/home.module.scss'
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import Head from 'next/head';
type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  publishedAt: string;
  duration: number;
  duratioAsString: string;
  url: string;
}
type HomeProps = {
  latestEpisodes: Array<Episode>
  allEpisodes: Array<Episode>
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { play, playList } = useContext(PlayerContext)
  const episodeList = [...latestEpisodes, ...allEpisodes]
  return (


    <div className={styles.homepage}>
      <Head>
        <title> Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (

              <li key={episode.id}>
                <Image width={192} height={192}
                  src={episode.thumbnail} alt={episode.title}
                  objectFit="cover"
                />
                <div className={styles.espisodeDetails}>
                  <Link href={`/episode/${episode.id}`}>
                    <a >{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.duratioAsString}</span>
                </div>

                <button onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            )
          })}

        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episodios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image width={120} height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>

                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a >{episode.title}</a>
                    </Link>
                  </td>
                  <td>
                    {episode.members}
                  </td>
                  <td style={{ width: 100 }}>
                    {episode.publishedAt}
                  </td>

                  <td>
                    {episode.duratioAsString}
                  </td>

                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episodio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>



        </table>
      </section>

    </div>
  )
}
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
  })


  const episodes = data.map(
    episode => {
      return {
        id: episode.id,
        title: episode.title,
        members: episode.members,
        thumbnail: episode.thumbnail,
        publishedAt: format(parseISO(episode.published_at), 'dd MMM yy', { locale: ptBR }),
        duration: Number(episode.file.duration),
        duratioAsString: ConvertDutarionToString(Number(episode.file.duration)),
        url: episode.file.url,

      };
    }
  )

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
