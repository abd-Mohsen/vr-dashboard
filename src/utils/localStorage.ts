// utils/localStorage.ts
export const LocalStorageKeys = {
    SELECTED_LAYOUT_ID: 'selectedLayoutId',
    SELECTED_LAYOUT_NAME: 'selectedLayoutName',
  } as const;
  
  export const getSelectedLayout = () => {
    const id = localStorage.getItem(LocalStorageKeys.SELECTED_LAYOUT_ID);
    const name = localStorage.getItem(LocalStorageKeys.SELECTED_LAYOUT_NAME);
    return { id, name };
  };
  
  export const setSelectedLayout = (id: string, name: string) => {
    localStorage.setItem(LocalStorageKeys.SELECTED_LAYOUT_ID, id);
    localStorage.setItem(LocalStorageKeys.SELECTED_LAYOUT_NAME, name);
  };
  
  export const clearSelectedLayout = () => {
    localStorage.removeItem(LocalStorageKeys.SELECTED_LAYOUT_ID);
    localStorage.removeItem(LocalStorageKeys.SELECTED_LAYOUT_NAME);
  };