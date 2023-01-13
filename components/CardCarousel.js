import { createStyles, Image, Card, Text, Group, Button } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useEffect, useState } from 'react';
import loadImagesService from 'services/load-images.service';

const useStyles = createStyles((theme, _params, getRef) => ({
  price: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },

  carousel: {
    '&:hover': {
      [`& .${getRef('carouselControls')}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getRef('carouselControls'),
    transition: 'opacity 150ms ease',
    opacity: 0,
  },

  carouselIndicator: {
    width: 4,
    height: 4,
    transition: 'width 250ms ease',

    '&[data-active]': {
      width: 16,
    },
  },
}));

const fetchImage = async (url) => {
  const netlifyURL = `/.netlify/functions/get-images?url=${encodeURIComponent(url)}`;
  let objurl;
  await fetch(netlifyURL, {
    // headers: { accept: 'Accept: application/json' },
  })
    .then((x) => x.json())
    .then(json => {
      const buff = Buffer.from(json.msg)
      objurl = URL.createObjectURL(
        new Blob([buff.buffer], { type: 'image/png' })
      );
      return objurl;
    });
  return objurl;
};

export function CarouselCard({ pk, imageURLs, title, rating, text, link }) {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  let promises;

  // useEffect(() => {
  //   promises = imageURLs.map(url => fetchImage(url));
  // }, [])

  const imageData = loadImagesService(pk);

  useEffect(() => {
    setLoading(true);
    setSlides(imageData.map((image) => (
      <Carousel.Slide key={image.pk}>
        <Image src={image.path} height={220} />
      </Carousel.Slide>
    )));
    setLoading(false);
  }, []);

  return (
    <Card radius="md" withBorder p="xl">
      <Card.Section>
        {!loading && slides.length != 0 &&
          <Carousel
            withIndicators
            loop
            classNames={{
              root: classes.carousel,
              controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
            }}
          >
            {!loading && slides}
          </Carousel>
        }
      </Card.Section>

      <Group position="apart" mt="lg">
        <Text weight={500} size="lg">
          {title}
        </Text>

        <Group spacing={5}>
          <Text size="xs" weight={500}>
            {rating}
          </Text>
        </Group>
      </Group>

      <Text size="sm" color="dimmed" mt="sm">
        {text}
      </Text>

      <Group position="apart" mt="md">
        <div>
          <Text size="xl" span weight={500} className={classes.price}>

          </Text>
          <Text span size="sm" color="dimmed">
            {' '}

          </Text>
        </div>

        <Button
          variant="subtle"
          radius="md"
          component="a"
          rel="noopener noreferrer"
          target="_blank"
          href={link}
          >See Post</Button>
      </Group>
    </Card>
  );
}
