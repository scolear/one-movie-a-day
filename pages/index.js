import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { IconSearch } from "@tabler/icons-react";
import {
  Center,
  Container,
  Stack,
  Space,
  Pagination,
  TextInput,
  Flex,
} from "@mantine/core";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { CarouselCard } from "@components/CardCarousel";
import dataLoaderService from "services/data-loader.service";
import Controls from "@components/Controls";

const dataLoaderSvc = dataLoaderService();

const usePaginator = (initialData, displayBatchSize) => {
  const [data, setData] = useState(initialData);
  const [pagesNo, setPagesNo] = useState(
    Math.ceil(data.length / displayBatchSize)
  );
  const [activePage, setActivePage] = useState(1);
  const [dataSlice, setDataSlice] = useState(data.slice(0, displayBatchSize));

  useEffect(() => {
    setPagesNo(Math.ceil(data.length / displayBatchSize));
  }, [data, displayBatchSize]);

  useEffect(() => {
    const startIndex = (activePage - 1) * displayBatchSize;
    setDataSlice(data.slice(startIndex, startIndex + displayBatchSize));
  }, [activePage, data, displayBatchSize]);

  return { data, setData, pagesNo, activePage, setActivePage, dataSlice };
};

export default function Home() {
  const displayBatchSize = 5;
  const { data, setData, pagesNo, activePage, setActivePage, dataSlice } =
    usePaginator(dataLoaderSvc.initialData, displayBatchSize);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm !== "") {
      const newData = dataLoaderSvc.search(searchTerm);
      setData(newData);
    } else {
      setData(dataLoaderSvc.initialData);
    }
  }, [searchTerm, setData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [dataSlice]);

  const orderByDate = useCallback(() => {
    const newData = [...data].sort(
      (a, b) => Date.parse(b.date) - Date.parse(a.date)
    );
    setData(newData);
  }, [data, setData]);

  const orderByRating = useCallback(() => {
    const newData = [...data].sort((a, b) => b.ratingValue - a.ratingValue);
    setData(newData);
  }, [data, setData]);

  return (
    <div className="container">
      <Head>
        <title>One Movie A Day</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center>
        <Header title={"#onemovieaday"} />
      </Center>
      <Flex
        gap="lg"
        justify="space-evenly"
        align="center"
        direction="row"
        wrap="nowrap"
      >
        <Controls byDate={orderByDate} byRating={orderByRating}></Controls>

        <TextInput
          placeholder="search"
          icon={<IconSearch size="0.8rem" />}
          size="xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </Flex>
      <Center></Center>
      <Space h="sm" />
      <Center>
        {/* <Pagination
          page={activePage}
          onChange={setActivePage}
          total={pagesNo}
          siblings={0}
          boundaries={1}
          color="red"
          size="sm"
          radius="md"
          withEdges
        /> */}
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
          onChange={setActivePage}
          total={pagesNo}
          siblings={0}
          boundaries={0}
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
