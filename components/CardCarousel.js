import { createStyles, Image, Card, Text, Group, Button } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconBrandInstagram } from "@tabler/icons";
import { useEffect, useState } from "react";
import loadImagesService from "services/load-images.service";

const useStyles = createStyles((theme, _params, getRef) => ({
  price: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  carousel: {
    "&:hover": {
      [`& .${getRef("carouselControls")}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getRef("carouselControls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  carouselIndicator: {
    width: 4,
    height: 4,
    transition: "width 250ms ease",

    "&[data-active]": {
      width: 16,
    },
  },
}));

const fetchImage = async (key) => {
  let objurl;
  const netlifyURL = `/.netlify/functions/get-image-s3?key=${key}`;
  await fetch(netlifyURL, {
    // headers: { accept: 'Accept: application/json' },
  })
    .then((x) => x.json())
    .then((json) => {
      const buff = Buffer.from(json);
      objurl = URL.createObjectURL(
        new Blob([buff.buffer], { type: "image/png" })
      );
      return objurl;
    });
  return objurl;
};

// fetchImage('2724792297288971559');

export function CarouselCard({ pk, title, rating, text, link }) {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  let promises;

  const imageData = loadImagesService(pk);

  useEffect(() => {
    promises = imageData.map((data) => fetchImage(data.pk));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all(promises)
      .then((values) => {
        setSlides(
          values.map((image) => (
            <Carousel.Slide key={image}>
              <Image src={image} height="100%" />
            </Carousel.Slide>
          ))
        );
      })
      .then(() => {
        setLoading(false);
      });
  }, [promises]);

  return (
    <Card radius="md" withBorder p="xl">
      <Card.Section>
        {!loading && slides.length != 0 && (
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
        )}
      </Card.Section>

      <Group position="apart" mt="lg">
        <Text weight={500} size="md">
          {title}
        </Text>

        <Group spacing={5}>
          <Text size="lg" weight={500}>
            {rating}
            <Text span weight={200} size="sm">
              /10
            </Text>
          </Text>
        </Group>
      </Group>

      <Text size="sm" color="dimmed" mt="sm">
        {text}
      </Text>

      <Group position="apart" mt="md">
        <div>
          <Text size="xl" span weight={500} className={classes.price}></Text>
          <Text span size="sm" color="dimmed">
            {" "}
          </Text>
        </div>

        <Button
          compact
          rightIcon={<IconBrandInstagram scale={0.1} />}
          variant="subtle"
          color="pink"
          radius="md"
          component="a"
          rel="noopener noreferrer"
          target="_blank"
          href={link}
        >
          See Post
        </Button>
      </Group>
    </Card>
  );
}
