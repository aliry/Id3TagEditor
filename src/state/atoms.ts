import { atom } from 'jotai';
import { IRowData } from 'types/types';

export interface IMessage {
  message: string;
  type: 'error' | 'info' | 'success' | 'warning';
}

export const currentFolderAtom = atom('');
export const messageAtom = atom<IMessage | null>(null);
export const isLoadingAtom = atom(false);
export const rowDataAtom = atom<IRowData[]>([]);
