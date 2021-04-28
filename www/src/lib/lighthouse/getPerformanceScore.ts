// compute a performance score from 0 to 100 from lighthouse report
export const getPerformanceScore = (report: LighthouseReport): number => {
  const firstContentfulPaint =
    report.audits.metrics.details?.items &&
    report.audits.metrics.details?.items[0].firstContentfulPaint; // in milliseconds
  const numRequests =
    report.audits.diagnostics.details?.items &&
    report.audits.diagnostics.details?.items[0].numRequests;
  const totalByteWeight =
    report.audits.diagnostics.details?.items &&
    report.audits.diagnostics.details?.items[0].totalByteWeight;

  const maxRequests = 30;
  const maxFirstPaint = 1000;
  const maxByteWeight = 1024 * 1024;

  let score = 100;

  // penalty for slow first contentful paint : -10 per additional second
  if (firstContentfulPaint > maxFirstPaint) {
    score -= Math.min(
      100 / 3,
      ((firstContentfulPaint - maxFirstPaint) / 1000) * 10
    );
  }
  // penalty for additional requests : -5 per additionnal request
  if (numRequests > maxRequests) {
    score -= Math.min(100 / 3, (numRequests - maxRequests) * 5);
  }
  // penalty for big totalByteWeight : -20 per Mb
  if (totalByteWeight > maxByteWeight) {
    score -= Math.min(
      100 / 3,
      ((totalByteWeight - maxByteWeight) / (1024 * 1024)) * 20
    );
  }

  score = Math.max(0, score / 100);
  return score;
};
