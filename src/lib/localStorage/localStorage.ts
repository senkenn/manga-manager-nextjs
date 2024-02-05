import { usersEntity } from '@lib/dynamodb/entities';
import { z } from 'zod';

const LocalStorageSchema = z.object({
  userId: usersEntity.shape.id,
});

type LocalStorageData = z.infer<typeof LocalStorageSchema>;

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private storage: Storage;

  private constructor() {
    this.storage = window.localStorage;
  }

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  public async setItem<K extends keyof LocalStorageData>(
    key: K,
    value: LocalStorageData[K],
  ): Promise<void> {
    const itemSchema = LocalStorageSchema.pick({ [key]: true });
    await itemSchema.parseAsync({ [key]: value });
    this.storage.setItem(key, JSON.stringify(value));
  }

  public async getItem<K extends keyof LocalStorageData>(key: K): Promise<LocalStorageData[K]> {
    const value = this.storage.getItem(key);
    if (value === null) {
      throw new Error(`Item with key ${key} does not exist`);
    }
    const itemSchema = LocalStorageSchema.pick({ [key]: true });
    const parsedValue = await itemSchema.parseAsync({
      [key]: JSON.parse(value),
    });
    return parsedValue[key];
  }

  public removeItem(key: keyof LocalStorageData): Promise<void> {
    this.storage.removeItem(key);
    return Promise.resolve();
  }
}
