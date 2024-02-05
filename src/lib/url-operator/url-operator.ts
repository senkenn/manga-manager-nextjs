import {
  EPISODE_NUMBER_SEARCH_REGEX,
  LATEST_EPISODE_URL_SEARCH_REGEX,
  TITLE_SEARCH_REGEX,
} from '@config/jumpPlus';
import { MangaEntity } from '@lib/dynamodb/entities';
import { err, Result } from '@utils/type-maps/type-maps';
import axios from 'axios';

type MangaInfo = {
  title: MangaEntity['title'];
  latestEpisodeUrl: MangaEntity['latestEpisodeUrl'];
  episodeNumber: MangaEntity['episodeNumber'];
};
type ResultGetMangaInfoFromEpisodeUrl = Result<
  MangaInfo,
  | {
      type: 'bad-url';
    }
  | {
      type: 'not-episodes-url';
    }
>;

export async function getMangaInfoFromEpisodesUrl(
  episodesUrl: string,
): Promise<ResultGetMangaInfoFromEpisodeUrl> {
  let data: string;
  try {
    data = (await axios.get(episodesUrl)).data;
  } catch (error) {
    return err('getMangaInfoFromEpisodesUrl', { type: 'bad-url' });
  }

  // get title
  const titleMatcher = data.match(TITLE_SEARCH_REGEX);
  const title = titleMatcher ? titleMatcher[1] : undefined;

  // get latest episode url
  const latestEpisodeUrlMatcher = data.match(LATEST_EPISODE_URL_SEARCH_REGEX);
  const latestEpisodeUrl = latestEpisodeUrlMatcher ? latestEpisodeUrlMatcher[1] : undefined;

  // get episode number
  const episodeNumberMatcher = data.match(EPISODE_NUMBER_SEARCH_REGEX);
  const episodeNumber = episodeNumberMatcher ? Number(episodeNumberMatcher[1]) : undefined;

  if (title === undefined || latestEpisodeUrl === undefined || episodeNumber === undefined) {
    return err('getMangaInfoFromEpisodesUrl', { type: 'not-episodes-url' });
  }

  return {
    title,
    latestEpisodeUrl,
    episodeNumber,
  };
}
