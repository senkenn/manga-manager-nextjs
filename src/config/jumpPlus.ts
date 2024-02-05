export const TITLE_SEARCH_REGEX = /<div id="post-data">.*?<h1>(.*?)<\/h1>/s;
export const LATEST_EPISODE_URL_SEARCH_REGEX = /<div class="list-scoll">.*?<a.*?href="(.*?)".*?>/s;
export const EPISODE_NUMBER_SEARCH_REGEX =
  /<div class="list-scoll">.*?<a.*?title=".*?【第(\d+)話】.*?".*?>/s;
