"use client";

import {
  Alert,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { FormEvent, useCallback, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

import { Code } from "@/types";
import { codeApi } from "@/resources/code";
import { TextAreaLabel } from "@/components";

export default function Home() {
  const { mutate: submit, isLoading, isError, error } = codeApi.useCodeSubmit();

  const { mutate: save, isLoading: isSaving } = codeApi.useCodeSave();

  const { mutate: update, isLoading: isUpdating } = codeApi.useCodeUpdate();

  const { mutate: deleteCode, isLoading: isDeleting } = codeApi.useCodeDelete();

  const { data, refetch } = codeApi.useCodeList();

  const [code, setCode] = useState("");
  const [loadedCode, setLoadedCode] = useState<Code | null>(null);
  const [codeName, setCodeName] = useState("");
  const [stdOut, setStdOut] = useState(null);
  const [stdErr, setStdErr] = useState(null);

  const [opened, { open, close }] = useDisclosure();
  const [openedView, { open: openView, close: closeView }] = useDisclosure();

  const codeArray = (data as Code[]) || null;

  const isEdited = loadedCode?.code !== code || loadedCode?.name !== codeName

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setStdOut(null);
      setStdErr(null);

      submit(code, {
        onSuccess: (res) => {
          const data = res;

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
      await save({ code, name: codeName }, {
        onSuccess: () => {
          close();
        }
      });
    }
  };

  const handleLoad = (code: Code) => {
    setLoadedCode(code);
    setCode(code.code);
    setCodeName(code.name);
    setStdOut(null);
    setStdErr(null);

    closeView();
  };

  const handleExit = () => {
    setLoadedCode(null);
    setCode("");
    setCodeName("");
    setStdOut(null);
    setStdErr(null);
  }

  const handleUpdateConfirm = async () => {
    if (codeName && loadedCode) {
      await update({ code, name: codeName, id: loadedCode._id }, {
        onSuccess: async () => {
          await refetch();

          close();

          handleExit();
        }
      });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCode({ id }, {
      onSuccess: async () => {
        await refetch();

        handleExit();
      }
    })
  }

  return (
    <div className="App">
      <Center p="10px 10px">
        <h1>SavaScript</h1>
      </Center>

      <form onSubmit={handleSubmit}>
        <Grid>
          <Grid.Col span={9}>
            <Textarea
              style={{
                fontSize: "24px",
              }}
              label={loadedCode && 
                <TextAreaLabel label={codeName} isEdited={isEdited} />
              }
              value={code}
              size="xl"
              name="code"
              minRows={10}
              onChange={(e) => setCode(e.target.value)}
            />

            {stdOut && (
              <Alert
                color="green.5"
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
                color="red.5"
                style={{
                  minHeight: "100px",
                  marginTop: "15px",
                }}
                fz="xl"
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
              <Button h={60} disabled={!code} loading={isLoading} type="submit" fullWidth>
                Send
              </Button>

              <Button
                h={60}
                disabled={!code}
                loading={isLoading}
                color="green.6"
                fullWidth
                onClick={handleSave}
              >
                {loadedCode ? "Update Code" : "Save Code"}
              </Button>

              <Button
                h={60}
                loading={isLoading}
                color="pink.5"
                fullWidth
                onClick={openView}
              >
                Load Code
              </Button>

              {loadedCode && <Button
                h={60}
                loading={isDeleting}
                color="red.5"
                fullWidth
                onClick={() => handleDelete(loadedCode?._id)}
              >
                Delete Code
              </Button>}

              {loadedCode && <Button
                h={60}
                loading={isLoading}
                color="grape.5"
                fullWidth
                onClick={handleExit}
              >
                Exit Edit
              </Button>}
            </Stack>
          </Grid.Col>
        </Grid>
      </form>

      <Modal onClose={close} opened={opened}>
        <Stack gap={10}>
          <TextInput
            label="Code name"
            value={codeName}
            onChange={(e) => setCodeName(e.target.value)}
          />

          {loadedCode ? (
            <Button 
              disabled={!isEdited} 
              onClick={handleUpdateConfirm} 
              loading={isUpdating}
            >
              Update Code
            </Button>
          ) : (
            <Button 
              disabled={!codeName} 
              onClick={handleSaveConfirm} 
              loading={isSaving}
            >
              Save code
            </Button>
          )}
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

                <Button onClick={() => handleLoad(code)}>Load</Button>

                <Button loading={isDeleting} color="red.5" onClick={() => handleDelete(code._id)}>Delete</Button>
              </Group>
            ))}
        </Stack>
      </Modal>
    </div>
  );
}
