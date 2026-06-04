import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { StripePersistence } from './contracts.js';
import type {
  ConnectedAccountRecord,
  PaymentRecord,
  PayoutRecord,
  StripeStoreShape,
  WebhookEventRecord
} from '../types/domain.js';

const EMPTY_STORE: StripeStoreShape = {
  paymentsByDedupeKey: {},
  paymentIntentIndex: {},
  connectedAccountsById: {},
  payoutsById: {},
  webhookEventsById: {}
};

export class FileStripePersistence implements StripePersistence {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  async getPaymentByDedupeKey(dedupeKey: string): Promise<PaymentRecord | null> {
    const store = await this.readStore();
    return store.paymentsByDedupeKey[dedupeKey] ?? null;
  }

  async getPaymentByPaymentIntentId(paymentIntentId: string): Promise<PaymentRecord | null> {
    const store = await this.readStore();
    const dedupeKey = store.paymentIntentIndex[paymentIntentId];
    if (!dedupeKey) return null;
    return store.paymentsByDedupeKey[dedupeKey] ?? null;
  }

  async savePayment(record: PaymentRecord): Promise<void> {
    await this.withStore(async (store) => {
      store.paymentsByDedupeKey[record.dedupeKey] = record;
      store.paymentIntentIndex[record.paymentIntentId] = record.dedupeKey;
    });
  }

  async getConnectedAccount(accountId: string): Promise<ConnectedAccountRecord | null> {
    const store = await this.readStore();
    return store.connectedAccountsById[accountId] ?? null;
  }

  async saveConnectedAccount(record: ConnectedAccountRecord): Promise<void> {
    await this.withStore(async (store) => {
      store.connectedAccountsById[record.accountId] = record;
    });
  }

  async getPayout(payoutId: string): Promise<PayoutRecord | null> {
    const store = await this.readStore();
    return store.payoutsById[payoutId] ?? null;
  }

  async savePayout(record: PayoutRecord): Promise<void> {
    await this.withStore(async (store) => {
      store.payoutsById[record.payoutId] = record;
    });
  }

  async hasProcessedWebhook(eventId: string): Promise<boolean> {
    const store = await this.readStore();
    return Boolean(store.webhookEventsById[eventId]);
  }

  async markWebhookProcessed(record: WebhookEventRecord): Promise<void> {
    await this.withStore(async (store) => {
      store.webhookEventsById[record.eventId] = record;
    });
  }

  private async withStore(mutator: (store: StripeStoreShape) => Promise<void>): Promise<void> {
    this.queue = this.queue.then(async () => {
      const store = await this.readStore();
      await mutator(store);
      await this.writeStore(store);
    });

    await this.queue;
  }

  private async readStore(): Promise<StripeStoreShape> {
    try {
      const file = await readFile(this.filePath, 'utf8');
      return {
        ...EMPTY_STORE,
        ...JSON.parse(file)
      } as StripeStoreShape;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('ENOENT')) {
        return structuredClone(EMPTY_STORE);
      }

      throw error;
    }
  }

  private async writeStore(store: StripeStoreShape): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(store, null, 2) + '\n', 'utf8');
  }
}
