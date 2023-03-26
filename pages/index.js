import Head from "next/head";
import { useState, useEffect } from "react";
import { Center, Container, Stack, Space, Pagination } from "@mantine/core";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { CarouselCard } from "@components/CardCarousel";
import dataLoaderService from "services/data-loader.service";
import Controls from "@components/Controls";

const dataLoaderSvc = dataLoaderService();

export default function Home() {
  const [data, setData] = useState(dataLoaderSvc.initialData);
  const [displayBatchSize, setDisplayBatchSize] = useState(5);
  const [pagesNo, setPagesNo] = useState(
    Math.ceil(data.length / displayBatchSize)
  );
  const [activePage, setPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [dataSlice, setDataSlice] = useState(data.slice(0, displayBatchSize));

  useEffect(() => {
    setStartIndex((activePage - 1) * displayBatchSize);
  }, [activePage]);

  useEffect(() => {
    setDataSlice(data.slice(startIndex, startIndex + displayBatchSize));
  }, [startIndex]);

  useEffect(() => {
    console.log("Setting new data");
    setDataSlice(data.slice(startIndex, startIndex + displayBatchSize));
  }, [data]);

  function orderByDate() {
    const newData = [...data];
    newData.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    setData(newData);
  }

  function orderByRating() {
    const newData = [...data];
    newData.sort((a, b) => b.ratingValue - a.ratingValue);
    setData(newData);
  }

  return (
    <div className="container">
      <Head>
        <title>One Movie A Day</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center>
        <Header title={"#onemovieaday"} />
      </Center>
      <Center>
        <Controls byDate={orderByDate} byRating={orderByRating}></Controls>
      </Center>
      <Space h="sm" />
      <Center>
        <Pagination
          page={activePage}
          onChange={setPage}
          total={pagesNo}
          siblings={0}
          boundaries={1}
          color="red"
          size="sm"
          radius="md"
          withEdges
        />
      </Center>
      <Space h="md" />
      <main>
        <Container size={600}>
          <Stack align="center">
            {dataSlice.map((props) => (
              <CarouselCard
                key={props.key}
                pk={props.key}
                title={props.movie_title}
                rating={props.rating}
                text={props.comment}
                link={props.link}
              />
            ))}
          </Stack>
        </Container>
      </main>
      <Space h="md" />
      <Center>
        <Pagination
          page={activePage}
          onChange={setPage}
          total={pagesNo}
          siblings={1}
          color="red"
          size="sm"
          radius="md"
          withEdges
        />
      </Center>
      <Space h="md" />
      <Footer />
    </div>
  );
}
