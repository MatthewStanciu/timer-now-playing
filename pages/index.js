import fetch from 'isomorphic-unfetch'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'

const Page = () => {
  const [song, setSong] = useState({})
  const [seconds, setSeconds] = useState(0)
  const [active, setActive] = useState(false)

  const fetchSong = async () => {
    const req = await fetch('/api/spotify')
    const data = await req.json()
    setSong(data)
  }
  if (isEmpty(song)) fetchSong()

  const onSetTimer = () => {
    const minutes = prompt('How many minutes?')
    const time = Number(minutes) * 60
    setSeconds(time)
    setActive(true)
  }

  const toggle = () => setActive(!active)

  const reset = () => {
    setSeconds(0)
    setActive(false)
  }

  useEffect(() => {
    let timerInterval = null
    // fetch song every 5 seconds
    let songInterval = setInterval(() => fetchSong(), 5000)
    if (active) {
      timerInterval = setInterval(() => {
        // decrement as long as the clock isn’t at 0 already
        setSeconds(seconds => (seconds === 0 ? 0 : seconds - 1))
      }, 1000)
    } else if (!active && seconds !== 0) {
      clearInterval(timerInterval)
    }
    return () => {
      clearInterval(songInterval)
      clearInterval(timerInterval)
    }
  }, [active, seconds])

  const clock = [Math.floor(seconds / 60), seconds % 60]
  // display 00 instead of 0
  clock.forEach((value, i) => {
    clock[i] = value === 0 ? '00' : value
  })

  return (
    <main>
      <img src={song.albumCover} className="bg" />
      <div className="content">
        <div className="timer">
          <div
            className={`clock is-${active ? '' : 'in'}active`}
            onDoubleClick={onSetTimer}
            onClick={toggle}
          >
            {clock[0]}:{clock[1]}
          </div>
        </div>
        <div className="music">
          <img
            className="music-cover"
            src={song.albumCover}
            width={256}
            height={256}
          />
          <h1 className="music-title">{song.title}</h1>
          <h2 className="music-artist">{song.artist}</h2>
        </div>
      </div>
      <style jsx>{`
        :global(body) {
          font-family: system-ui;
          margin: 0;
        }
        :global(*) {
          box-sizing: border-box;
        }
        main {
          background-color: #e42d42;
          min-height: 100vh;
        }
        .bg {
          width: 105vw;
          position: fixed;
          z-index: 0;
          left: 0;
          right: 0;
          filter: brightness(0.75) blur(20px);
          transform: translateY(-25%);
          margin: 0 -2rem;
        }
        .content {
          z-index: 2;
          position: fixed;
          color: white;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-column-gap: 6rem;
          align-items: center;
          justify-content: center;
        }
        .timer {
          text-align: right;
        }
        .timer button {
        }
        .clock {
          font-size: 10rem;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }
        .clock.is-active {
          text-shadow: 0 0 8px white;
        }
        .clock.is-inactive {
          opacity: 0.75;
        }
        .music {
        }
        .music-cover {
          border-radius: 8px;
        }
        .music-title {
          font-size: 2rem;
          font-weight: 800;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          max-width: 24rem;
        }
        .music-artist {
          font-weight: 400;
          margin: 0;
        }
      `}</style>
    </main>
  )
}

export default Page
