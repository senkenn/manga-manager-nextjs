import { z } from 'zod';

z.setErrorMap((_, ctx) => {
  return { message: `${ctx.defaultError}, data: ${ctx.data}` };
});

export const mangaEntity = z.object({
  id              : z.string().uuid(),
  title           : z.string(),
  episodesUrl     : z.string().url(),
  latestEpisodeUrl: z.string().url(),
  episodeNumber   : z.number(),
  createdAt       : z.string().datetime(),
  updatedAt       : z.string().datetime(),
});
export type MangaEntity = z.infer<typeof mangaEntity>;

export const usersEntity = z.object({
  id       : z.string().uuid(),
  email    : z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type UsersEntity = z.infer<typeof usersEntity>;

export const usersMangaEntity = z.object({
  id           : z.string().uuid(),
  userId       : usersEntity.shape.id,
  mangaId      : mangaEntity.shape.id,
  isAlreadyRead: z.boolean(),
  createdAt    : z.string().datetime(),
  updatedAt    : z.string().datetime(),
});
export type UsersMangaEntity = z.infer<typeof usersMangaEntity>;

export const TABLES = {
  mainTable: 'MangaManagerMainTable',
};
