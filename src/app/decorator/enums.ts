export const QualityGateBadgeType = {
  PASSED: "passed",
  FAILED: "failed",
};

export type QualityGateBadgeTypeUnion = (typeof QualityGateBadgeType)[keyof typeof QualityGateBadgeType];

export const CoverageChartType = {
  NO_COVERAGE_INFO: "NoCoverageInfo",
  ZERO: "0",
  QUARTER: "25",
  FOURTY: "40",
  FIFTY: "50",
  SIXTY: "60",
  NINETY: "90",
  FULL: "100",
};

export type CoverageChartTypeUnion = (typeof CoverageChartType)[keyof typeof CoverageChartType];

export const DuplicationsType = {
  NO_DUPLICATION_INFO: "NoDuplicationInfo",
  THREE: "3",
  FIVE: "5",
  TEN: "10",
  TWENTY: "20",
  TWENTY_PLUS: "20plus",
};

export type DuplicationsTypeUnion = (typeof DuplicationsType)[keyof typeof DuplicationsType];
