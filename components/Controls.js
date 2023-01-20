import { Button, Group } from "@mantine/core";

export default function Controls({byDate, byRating}) {
  return (
    <Group position="center">
      <Button variant="subtle" color="pink" onClick={() => byDate()}>
        sort by date
      </Button>
      <Button variant="subtle" color="pink" onClick={() => byRating()}>
        sort by rating
      </Button>
    </Group>
  )
}
