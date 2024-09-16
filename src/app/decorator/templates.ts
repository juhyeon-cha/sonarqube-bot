import { CoverageChartType, CoverageChartTypeUnion, DuplicationsType, DuplicationsTypeUnion, QualityGateBadgeTypeUnion } from "@t/app/decorator/enums";

const IMAGE_ROOT = "https://raw.githubusercontent.com/mc1arke/sonarqube-community-branch-plugin/master/src/main/resources/static";
const _COVERAGE = "Coverage";
const _DUPLICATION = "Duplication";
const NO_COVERAGE_INFO = "No coverage information";
const NO_DUPLICATION_INFO = "No duplication information";

export const templates = {
  qualityGateBadge: {
    image: (qualityGateBadgeType: QualityGateBadgeTypeUnion) => `![${qualityGateBadgeType}](${IMAGE_ROOT}/checks/QualityGateBadge/${qualityGateBadgeType}.svg)`,
  },
  title: "## Analysis Details",
  issues: {
    title: (issueCount: number) => `### ${issueCount} Issues`,
    bug: (bugCount: number) => `- ![bug](${IMAGE_ROOT}/IssueType/bug.svg) ${bugCount} Bugs`,
    vulnerability: (vulnerabilityCount: number) => `- ![vulnerability](${IMAGE_ROOT}/IssueType/vulnerability.svg) ${vulnerabilityCount} Vulnerabilities`,
    securityHotspot: (securityHotspotCount: number) => `- ![security_hotspot](${IMAGE_ROOT}/IssueType/security_hotspot.svg) ${securityHotspotCount} Security Hotspots`,
    codeSmell: (codeSmellCount: number) => `- ![code_smell](${IMAGE_ROOT}/IssueType/code_smell.svg) ${codeSmellCount} Code Smells`,
  },
  coverageAndDuplication: {
    noData: "No data available",
    title: `### ${_COVERAGE} and ${_DUPLICATION}`,
    coverage: (coverageChartType: CoverageChartTypeUnion) => {
      let text = NO_COVERAGE_INFO;
      if (coverageChartType !== CoverageChartType.NO_COVERAGE_INFO) {
        text = `${coverageChartType} % ${_COVERAGE}`;
      }

      return `![${text}](${IMAGE_ROOT}/checks/CoverageChart/${coverageChartType}.svg) ${text}`;
    },
    duplication: (duplicationsType: DuplicationsTypeUnion) => {
      let text = NO_DUPLICATION_INFO;
      if (duplicationsType !== DuplicationsType.NO_DUPLICATION_INFO) {
        text = `${duplicationsType} % ${_DUPLICATION}`;
      }

      return `![${text}](${IMAGE_ROOT}/checks/Duplications/${duplicationsType}.svg) ${text}`;
    },
    estimatedAfterMerge: (estimatedPercent: number) => `(${estimatedPercent}% Estimated coverage after merge)`,
  },
};
