import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { CarouselCard } from '@components/CardCarousel'
import { Container } from '@mantine/core';
import dataLoaderService from 'services/data-loader.service'

const data = dataLoaderService().getSortedByDate().slice(16, 18);

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>One Movie A Day</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title={'#onemovieaday'}/>
      <main>
        <Container>
        {data.map(props => (
            <CarouselCard key={props.key} imageURLs={props.resources} title={props.movie_title} rating={props.rating} text={props.comment} link={props.link} />
          ))}
        </Container>
      </main>

      <Footer />
    </div>
  )
}
