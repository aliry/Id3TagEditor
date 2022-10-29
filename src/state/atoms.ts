import { atom } from 'jotai';
import { IRowData } from 'types/types';

export const currentFolderAtom = atom('');
export const errorMessageAtom = atom('');
export const isLoadingAtom = atom(false);
export const rowDataAtom = atom<IRowData[]>([]);
