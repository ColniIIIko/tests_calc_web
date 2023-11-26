import { Group, Paper, Text, TextareaProps } from "@mantine/core"
import { FC } from "react";

interface TextAreaLabelProps extends TextareaProps {
  isEdited?: boolean;
}

const TextAreaLabel: FC<TextAreaLabelProps> = ({ label, isEdited }) => {
  return (
    <Group gap="sm" pb={10}>
      <Text>
        {label}
      </Text>

      <Paper p={8} bg={isEdited ? 'pink' : 'green.3'} radius="xl">
        <Text c="white">
          {isEdited ? 'Edited' : 'Saved'}
        </Text>
      </Paper>
    </Group>
  )
}

export default TextAreaLabel;
