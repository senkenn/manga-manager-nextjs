import { MangaList } from '@server-actions/manga-list';
import { atom, useRecoilState } from 'recoil';

import SwipeItem from './SwipeItem';

type SwipeListProps = {
  mangaList: MangaList;
};

const swipeListAtom = atom({
  key    : 'swipeList',
  default: {
    hasDraggedItem: false,
    key           : '',
  },
});

export default function SwipeList({ mangaList }: SwipeListProps): JSX.Element {
  const [swipeListInfo, setSwipeListInfo] = useRecoilState(swipeListAtom);
  const { hasDraggedItem, key } = swipeListInfo;

  return (
    <div>
      {mangaList.map((manga) => (
        <SwipeItem key={manga.usersMangaId} manga={manga} hasDraggedItem={hasDraggedItem}/>
      ))}
    </div>
  );
}
