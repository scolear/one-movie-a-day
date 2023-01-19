import { Button, Group } from "@mantine/core";

export default function Controls() {
  return (
    <Group position="center">
      <Button variant="subtle" color="pink">
        sort by date
      </Button>
      <Button variant="subtle" color="pink">
        sort by rating
      </Button>
    </Group>
  )
}
