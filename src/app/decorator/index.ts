import { Sonar } from "@/sonarqube/sonar";
import { SonarMetricKey } from "@/sonarqube/enums";
import { isNil } from "lodash-es";
import { templates } from "@/app/decorator/templates";
import { CoverageChartType, DuplicationsType, QualityGateBadgeType } from "@/app/decorator/enums";
import { MeasuresAdditionalFields } from "@/sonarqube/resources/measures";

export async function makeDecorationComment(sonar: Sonar, repositoryName: string, pullRequestId: number): Promise<string> {
  const projectKey = await sonar.components.searchProjects(`query="${repositoryName}"`).then((res) => res.data.components?.[0]?.key);
  if (isNil(projectKey)) {
    return `${templates.title}\nProject not found.`;
  }

  const metricKeys = [
    // issues
    SonarMetricKey.violations,
    SonarMetricKey.bugs,
    SonarMetricKey.vulnerabilities,
    SonarMetricKey.securityHotspots,
    SonarMetricKey.codeSmells,
    // quality gate
    SonarMetricKey.newReliabilityRating,
    SonarMetricKey.newSecurityRating,
    SonarMetricKey.newMaintainabilityRating,
    SonarMetricKey.newCoverage,
    SonarMetricKey.newDuplicatedLinesDensity,
    // estimated after merge
    SonarMetricKey.coverage,
    SonarMetricKey.duplicatedLinesDensity,
  ];
  const measures = await sonar.measures.component(projectKey, metricKeys, [MeasuresAdditionalFields.metrics], undefined, pullRequestId).then((res) => res.data.component.measures);
  const qualityGates = await sonar.qualityGates.projectStatus(projectKey, pullRequestId).then((res) => res.data);
  const qualityGateBadgeType = qualityGates.projectStatus.status === "OK" ? QualityGateBadgeType.PASSED : QualityGateBadgeType.FAILED;

  const coverage = measures.find((m) => m.metric === SonarMetricKey.newCoverage);
  const coveragePercent = Number(coverage?.period?.value || -1);
  let coverageChartType = CoverageChartType.NO_COVERAGE_INFO;
  if (coveragePercent == 0) {
    coverageChartType = CoverageChartType.ZERO;
  } else if (coveragePercent < 25) {
    coverageChartType = CoverageChartType.QUARTER;
  } else if (coveragePercent < 40) {
    coverageChartType = CoverageChartType.FOURTY;
  } else if (coveragePercent < 50) {
    coverageChartType = CoverageChartType.FIFTY;
  } else if (coveragePercent < 60) {
    coverageChartType = CoverageChartType.SIXTY;
  } else if (coveragePercent < 90) {
    coverageChartType = CoverageChartType.NINETY;
  } else {
    coverageChartType = CoverageChartType.FULL;
  }
  const estimatedCoverage = Number(measures.find((m) => m.metric === SonarMetricKey.coverage)?.value || 0).toFixed(2);

  const duplicatedLinesDensity = measures.find((m) => m.metric === SonarMetricKey.newDuplicatedLinesDensity);
  const duplicationPercent = Number(duplicatedLinesDensity?.period?.value || -1);
  let duplicationsType = DuplicationsType.NO_DUPLICATION_INFO;
  if (duplicationPercent > 3) {
    duplicationsType = DuplicationsType.THREE;
    if (duplicationPercent < 5) {
      duplicationsType = DuplicationsType.FIVE;
    } else if (duplicationPercent < 10) {
      duplicationsType = DuplicationsType.TEN;
    } else if (duplicationPercent < 15) {
      duplicationsType = DuplicationsType.TWENTY;
    } else {
      duplicationsType = DuplicationsType.TWENTY_PLUS;
    }
  }
  const estimatedDuplication = Number(measures.find((m) => m.metric === SonarMetricKey.duplicatedLinesDensity)?.value || 0).toFixed(2);

  const comment = [
    templates.qualityGateBadge.image(qualityGateBadgeType),
    "",
    templates.title,
    "",
    templates.issues.title(Number(measures.find((m) => m.metric === SonarMetricKey.violations)?.value)),
    "",
    templates.issues.bug(Number(measures.find((m) => m.metric === SonarMetricKey.bugs)?.value)),
    templates.issues.vulnerability(Number(measures.find((m) => m.metric === SonarMetricKey.vulnerabilities)?.value)),
    templates.issues.securityHotspot(Number(measures.find((m) => m.metric === SonarMetricKey.securityHotspots)?.value)),
    templates.issues.codeSmell(Number(measures.find((m) => m.metric === SonarMetricKey.codeSmells)?.value)),
    "",
    templates.coverageAndDuplication.title,
    "",
    templates.coverageAndDuplication.coverage(coverageChartType, coveragePercent, estimatedCoverage),
    templates.coverageAndDuplication.duplication(duplicationsType, duplicationPercent, estimatedDuplication),
    "",
    templates.viewInSonar(sonar.config.baseURL, projectKey, pullRequestId),
  ];

  return comment.join("\n");
}

export function extractPullRequestIdFromComment(commentBody: string): number | null {
  const match = commentBody.match(/\[View in SonarQube\]\(.*pullRequest=(\d+)\)/);
  return Number(match?.[1] || null);
}
