import { Button, Group } from "@mantine/core";

export default function Controls() {
  return (
    <Group position="center" grow>
      <Button>
        By Date
      </Button>
      <Button>
        By Rating
      </Button>
    </Group>
  )
}
