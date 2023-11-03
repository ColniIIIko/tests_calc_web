"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { FormEvent, useCallback, useState } from "react";

import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useDisclosure } from "@mantine/hooks";

interface Code {
  _id: string;
  code: string;
  name: string;
  createdOn: string;
}

const useCodeSubmit = () => {
  const submitCode = async (code: string) => {
    console.log(code);
    return axios.post("http://localhost:8000/submit", {
      code,
    });
  };
  return useMutation(submitCode);
};

const useCodeList = () => {
  const listCode = () => axios.get("http://localhost:8000/code");

  return useQuery(["code"], listCode);
};

const useCodeSave = () => {
  const saveCode = async ({ code, name }: { code: string; name: string }) => {
    console.log(code);
    return axios.post("http://localhost:8000/code", {
      code,
      name,
    });
  };
  return useMutation(saveCode);
};

export default function Home() {
  const { mutate: submit, isLoading, isError, error } = useCodeSubmit();
  const { mutate: save, isLoading: isSaving } = useCodeSave();
  const [code, setCode] = useState("");
  const [codeName, setCodeName] = useState("");
  const [stdOut, setStdOut] = useState(null);
  const [stdErr, setStdErr] = useState(null);
  const [opened, { open, close }] = useDisclosure();
  const [openedView, { open: openView, close: closeView }] = useDisclosure();
  const { data } = useCodeList();

  const codeArray = (data?.data as Code[]) || null;
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStdOut(null);
      setStdErr(null);
      submit(code, {
        onSuccess: (res) => {
          const data = res.data;
          data.stderr ? setStdErr(data.stderr) : setStdOut(data.stdout);
        },
      });
    },
    [code, submit]
  );

  const handleSave = useCallback(() => {
    if (code) {
      open();
    }
  }, [code, open]);

  const handleSaveConfirm = async () => {
    if (codeName) {
      await save({ code, name: codeName });
      close();
    }
  };

  const handleLoad = (code: string) => {
    setCode(code);
    closeView();
  };

  return (
    <div className="App">
      <Container p="10px 10px">
        <h1>SavaScript</h1>
      </Container>
      <form onSubmit={handleSubmit}>
        <Grid>
          <Grid.Col span={9}>
            <Textarea
              style={{
                fontSize: "24px",
              }}
              value={code}
              size="lg"
              name="code"
              minRows={10}
              onChange={(e) => setCode(e.target.value)}
            />
            {stdOut && (
              <Alert
                color="cyan"
                style={{
                  minHeight: "100px",
                  marginTop: "15px",
                  fontSize: "26px",
                }}
              >
                {stdOut}
              </Alert>
            )}
            {isError && (
              <Alert
                color="red"
                style={{
                  minHeight: "100px",
                  marginTop: "15px",
                  fontSize: "26px",
                }}
              >
                {(error as any).message}
              </Alert>
            )}
            {stdErr && (
              <Alert
                color="red"
                style={{
                  minHeight: "100px",
                  marginTop: "15px",
                  fontSize: "26px",
                }}
                styles={{
                  message: {
                    fontSize: "lg",
                  },
                }}
              >
                {stdErr}
              </Alert>
            )}
          </Grid.Col>
          <Grid.Col span={2}>
            <Stack gap={12}>
              <Button h={60} loading={isLoading} type="submit" fullWidth>
                Send
              </Button>
              <Button
                h={60}
                loading={isLoading}
                bg={"lime"}
                fullWidth
                onClick={handleSave}
              >
                Save code
              </Button>
              <Button
                h={60}
                loading={isLoading}
                bg={"pink"}
                fullWidth
                onClick={openView}
              >
                Load Code
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </form>
      <Modal onClose={close} opened={opened}>
        <Stack gap={10}>
          <TextInput
            label="code name"
            value={codeName}
            onChange={(e) => setCodeName(e.target.value)}
          />
          <Button onClick={handleSaveConfirm} loading={isSaving}>
            save code
          </Button>
        </Stack>
      </Modal>
      <Modal
        onClose={closeView}
        opened={openedView}
        styles={{ content: { height: "90vh", minWidth: "80vw" } }}
      >
        <Stack gap={10}>
          {codeArray &&
            codeArray.map((code) => (
              <Group key={code._id} gap={20}>
                <Text>{code.code}</Text>
                <Text>{code.name}</Text>
                <Text>{code.createdOn}</Text>
                <Button onClick={() => handleLoad(code.code)}>Load</Button>
              </Group>
            ))}
        </Stack>
      </Modal>
    </div>
  );
}
