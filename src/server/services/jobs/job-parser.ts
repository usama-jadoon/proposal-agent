export class JobParser {
  /**
   * Extracts the deterministic job Hash (~id) from an Upwork URL.
   * Format example: https://www.upwork.com/jobs/~01abc123def456
   */
  static extractUpworkIdFromUrl(url: string): string {
    const match = url.match(/~[a-zA-Z0-9]+/);
    if (!match) {
      throw new Error('Invalid Upwork URL: Cannot extract Job ID hash');
    }
    return match[0];
  }

  /**
   * Standardizes the budgetInfo JSONB structure based on provided payload.
   */
  static formatBudgetInfo(budget?: number | null, hourlyRate?: string | null) {
    if (budget) {
      return { type: 'fixed', amount: budget };
    }
    if (hourlyRate) {
      return { type: 'hourly', range: hourlyRate };
    }
    return { type: 'unknown' };
  }
}
