import { useMutation, useQuery } from 'react-query';

import { apiService } from '../../services';

export const useCodeSubmit = () => {
  const submitCode = async (code: string) => {
    console.log(code);

    return apiService.post("submit", {
      code,
    });
  };

  return useMutation(submitCode);
};

export const useCodeList = () => {
  const listCode = () => apiService.get("code");

  return useQuery(["code"], listCode);
};

export const useCodeSave = () => {
  const saveCode = async ({ code, name }: { code: string; name: string }) => {
    console.log(code);

    return apiService.post("code", {
      code,
      name,
    });
  };

  return useMutation(saveCode);
};

export const useCodeUpdate = () => {
  const updateCode = async ({ code, name, id }: { code: string; name: string, id: string }) => {
    return apiService.put(`code/${id}`, {
      code,
      name,
    });
  };

  return useMutation(updateCode);
};

export const useCodeDelete = () => {
  const deleteCode = async ({ id }: { id: string }) => {
    return apiService.delete(`code/${id}`);
  };

  return useMutation(deleteCode);
};
