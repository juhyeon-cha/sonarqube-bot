import { Sonar } from "@/sonarqube/sonar";
import { SonarMetricKey } from "@t/sonarqube/enums";
import { isNil } from "lodash-es";
import { templates } from "@/app/decorator/templates";
import { CoverageChartType, DuplicationsType, QualityGateBadgeType } from "@t/app/decorator/enums";

export async function makeDecorationComment(sonar: Sonar, repositoryName: string, pullRequestId: number): Promise<string> {
  const projectKey = await sonar.projects.search(`filter="${repositoryName}"`).then((res) => res.data.components?.[0]?.key);
  if (isNil(projectKey)) {
    return `## ${templates.title}\nProject not found.`;
  }

  const projectPullRequests = await sonar.projectPullRequests.list(projectKey).then((prs) => prs.data.pullRequests);
  const pullRequest = projectPullRequests.find((pr) => pr.key === String(pullRequestId));
  if (isNil(pullRequest)) {
    return `## ${templates.title}\nPull request not found.`;
  }

  const measures = await sonar.measures.component(projectKey, Object.values(SonarMetricKey), undefined, undefined, pullRequestId).then((res) => res.data.component.measures);
  // const qualityGates = await sonar.qualityGates.projectStatus(projectKey).then((res) => res.data);
  const qualityGateBadgeType = pullRequest.status.qualityGateStatus === "OK" ? QualityGateBadgeType.PASSED : QualityGateBadgeType.FAILED;

  const newCoverage = measures.find((m) => m.metric === SonarMetricKey.newCoverage);
  const coveragePercent = Number(newCoverage?.value || -1);
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
  // const estimatedCoverage = Number(measures.find((m) => m.metric === SonarMetricKey.coverage)?.value || 0);
  const duplicatedLinesDensity = measures.find((m) => m.metric === SonarMetricKey.duplicatedLinesDensity);
  const duplicationPercent = Number(duplicatedLinesDensity?.value || -1);
  let duplicationsType = DuplicationsType.NO_DUPLICATION_INFO;
  if (duplicationPercent > 3) {
    if (duplicationPercent < 5) {
      duplicationsType = DuplicationsType.THREE;
    } else if (duplicationPercent < 10) {
      duplicationsType = DuplicationsType.FIVE;
    } else if (duplicationPercent < 15) {
      duplicationsType = DuplicationsType.TEN;
    } else if (duplicationPercent < 20) {
      duplicationsType = DuplicationsType.TWENTY;
    } else {
      duplicationsType = DuplicationsType.TWENTY_PLUS;
    }
  }
  // const estimatedDuplication = Number(measures.find((m) => m.metric === SonarMetricKey.duplicatedLinesDensity)?.value || 0);

  console.log(measures);
  const comment = [
    templates.qualityGateBadge.image(qualityGateBadgeType),
    "",
    templates.title,
    "",
    templates.issues.title(Number(measures.find((m) => m.metric === SonarMetricKey.newViolations)?.value)),
    "",
    templates.issues.bug(Number(measures.find((m) => m.metric === SonarMetricKey.newBugs)?.value)),
    templates.issues.vulnerability(Number(measures.find((m) => m.metric === SonarMetricKey.newVulnerabilities)?.value)),
    templates.issues.securityHotspot(Number(measures.find((m) => m.metric === SonarMetricKey.newSecurityHotspots)?.value)),
    templates.issues.codeSmell(Number(measures.find((m) => m.metric === SonarMetricKey.newCodeSmells)?.value)),
    "",
    templates.coverageAndDuplication.title,
    "",
    templates.coverageAndDuplication.coverage(coverageChartType),
    templates.coverageAndDuplication.duplication(duplicationsType),
  ];

  return comment.join("\n");
}
