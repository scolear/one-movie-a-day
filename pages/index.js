import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { CarouselCard } from '@components/CardCarousel'
import { Center, Container } from '@mantine/core';
import dataLoaderService from 'services/data-loader.service'
import Controls from '@components/Controls';

const found = dataLoaderService().initialData;
// NOTE: temporary
const data = found
console.log(data)

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>One Movie A Day</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center>
        <Header title={'#onemovieaday'}/>
      </Center>
      <Center>
        <Controls></Controls>
      </Center>
      <main>
        <Container size={600}>
        {data.map(props => (
            <CarouselCard key={props.key} pk={props.key} title={props.movie_title} rating={props.rating} text={props.comment} link={props.link} />
          ))}
        </Container>
      </main>

      <Footer />
    </div>
  )
}
