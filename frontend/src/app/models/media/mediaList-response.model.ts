import { MediaResponse } from './media-response.model';

export interface MediaListResponse {
  items: MediaResponse[];
  total: number;
  max: number;
}
