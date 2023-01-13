import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { CarouselCard } from '@components/CardCarousel'
import { Container } from '@mantine/core';
import dataLoaderService from 'services/data-loader.service'

const found = dataLoaderService().initialData.find(d => d.key == '2724792305325435269');
console.log(found)
const data = [found]
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
            <CarouselCard key={props.key} pk={props.key} imageURLs={props.resources} title={props.movie_title} rating={props.rating} text={props.comment} link={props.link} />
          ))}
        </Container>
      </main>

      <Footer />
    </div>
  )
}
