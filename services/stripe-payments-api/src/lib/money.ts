export function assertMinorUnitAmount(amount: number): number {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Amount must be a positive integer in the smallest currency unit.');
  }

  return amount;
}

export function calculateInstantPayoutFee(amount: number, feeBps: number, minimumFee: number): number {
  const percentageFee = Math.ceil((amount * feeBps) / 10_000);
  return Math.max(percentageFee, minimumFee);
}

export function estimateArrivalIso(payoutType: 'standard' | 'instant'): string {
  const now = new Date();
  if (payoutType === 'instant') {
    return new Date(now.getTime() + 30 * 60 * 1000).toISOString();
  }

  return new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
}
