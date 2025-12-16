export interface StudentRecord {
  name: string;
  icNumber: string;
  certLink: string;
}

export enum SearchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  ERROR = 'ERROR',
  CERT_NOT_READY = 'CERT_NOT_READY'
}

export interface SearchFormData {
  name: string;
  icNumber: string;
}
