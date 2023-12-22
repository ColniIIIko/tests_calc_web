"use client";

import {
  Alert,
  Button,
  Center,
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
import { notifications } from '@mantine/notifications';
import { IconX, IconCheck } from '@tabler/icons-react'

import { Code } from "@/types";
import { codeApi } from "@/resources/code";
import { TextAreaLabel } from "@/components";
import { getErrorName } from "@/utils";

export default function Home() {
  const { 
    mutate: submit, 
    isLoading, error: 
    submitError 
  } = codeApi.useCodeSubmit();

  const { 
    mutate: save, 
    isLoading: isSaving, 
    error: saveError }
   = codeApi.useCodeSave();

  const { 
    mutate: update, 
    isLoading: isUpdating, 
    error: updateError 
  } = codeApi.useCodeUpdate();

  const { 
    mutate: deleteCode, 
    isLoading: isDeleting, 
    error: deleteError 
  } = codeApi.useCodeDelete();

  const { data, refetch } = codeApi.useCodeList();

  const [code, setCode] = useState<string>("");
  const [loadedCode, setLoadedCode] = useState<Code | null>(null);
  const [codeName, setCodeName] = useState<string>("");
  const [stdOut, setStdOut] = useState<string | null>(null);

  const [opened, { open, close }] = useDisclosure();
  const [openedView, { open: openView, close: closeView }] = useDisclosure();

  const codeArray = (data as Code[]) || null;

  const isEdited = loadedCode?.code !== code || loadedCode?.name !== codeName

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setStdOut(null);

      submit(code, {
        onSuccess: (res) => {
          const data = res;

          if (data.stderr) {
            notifications.show({
              title: 'Error',
              color: 'red',
              message: getErrorName(data.stderr),
              icon: <IconX style={{ width: 18, height: 18 }} />,
              radius: 'md',
            });

            return;
          }

          notifications.show({
            title: 'Success',
            message: 'Code was successfully compiled !',
            color: 'teal',
            icon: <IconCheck style={{ width: 18, height: 18 }} />,
            radius: 'md',
          })

          setStdOut(data.stdout);
        },
        onError: () => {
          notifications.show({
            title: 'Error',
            color: 'red',
            message: (submitError as any).message || 'Something went wrong. Try again !',
            icon: <IconX style={{ width: 18, height: 18 }} />,
            radius: 'md',
          })
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
        onSuccess: async () => {
          await refetch();

          close();

          notifications.show({
            title: 'Success',
            message: 'Code was succesfully saved !',
            color: 'teal',
            icon: <IconCheck style={{ width: 18, height: 18 }} />,
            radius: 'md',
          })
        },
        onError: () => {
          notifications.show({
            title: 'Error',
            color: 'red',
            message: (saveError as any).message || 'Something went wrong. Try again !',
            icon: <IconX style={{ width: 18, height: 18 }} />,
            radius: 'md',
          })
        }
      });
    }
  };

  const handleLoad = (code: Code) => {
    setLoadedCode(code);
    setCode(code.code);
    setCodeName(code.name);
    setStdOut(null);

    closeView();
  };

  const handleExit = () => {
    setLoadedCode(null);
    setCode("");
    setCodeName("");
    setStdOut(null);
  }

  const handleUpdateConfirm = async () => {
    if (codeName && loadedCode) {
      await update({ code, name: codeName, id: loadedCode._id }, {
        onSuccess: async () => {
          await refetch();

          close();

          notifications.show({
            title: 'Success',
            message: 'Code was succesfully updated !',
            color: 'teal',
            icon: <IconCheck style={{ width: 18, height: 18 }} />,
            radius: 'md',
          })

          handleExit();
        },
        onError: () => {
          notifications.show({
            title: 'Error',
            color: 'red',
            message: (updateError as any).message || 'Something went wrong. Try again !',
            icon: <IconX style={{ width: 18, height: 18 }} />,
            radius: 'md',
          })
        }
      });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCode({ id }, {
      onSuccess: async () => {
        await refetch();

        notifications.show({
          title: 'Success',
          message: 'Code was successfully deleted !',
          color: 'teal',
          icon: <IconCheck style={{ width: 18, height: 18 }} />,
          radius: 'md',
        })

        handleExit();

        closeView();
      },
      onError: () => {
        notifications.show({
          title: 'Error',
          color: 'red',
          message: (deleteError as any).message || 'Something went wrong. Try again !',
          icon: <IconX style={{ width: 18, height: 18 }} />,
          radius: 'md',
        })
      }
    })
  }

  return (
    <div className="App" style={{ height: '100%' }}>
      <Center p="10px 10px">
        <h1>SavaScript</h1>
      </Center>

      <form onSubmit={handleSubmit}>
        <Grid>
          <Grid.Col span={9}>
            <Textarea
              fz="24px"
              label={loadedCode && 
                <TextAreaLabel label={codeName} isEdited={isEdited} />
              }
              value={code}
              name="code"
              minRows={10}
              onChange={(e) => setCode(e.target.value)}
              autosize
            />

            {stdOut && (
              <Alert
                color="green.5"
                style={{
                  minHeight: "100px",
                  marginTop: "15px",
                }}
              >
                {stdOut.split('\n').filter(out => !!out).map(out => <Text fz={20}>{out}</Text>) }
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
