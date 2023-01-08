import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import Card from '@components/Card'
import dataLoaderService from 'services/data-loader.service'

const data = dataLoaderService();

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>One Movie A Day</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="card-container">
          {data.map(props => (
            <Card key={props.key} images={props.resources} title={props.movie_title} rating={props.rating} text={props.comment} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
