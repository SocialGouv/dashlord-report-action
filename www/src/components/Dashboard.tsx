import * as React from "react";

import { Table } from "react-bootstrap";
import { Slash, Info, Search } from "react-feather";
import { Link } from "react-router-dom";
import Tooltip from "rc-tooltip";

import { Grade } from "./Grade";
import { sortByKey, smallUrl, isToolEnabled } from "../utils";

import "rc-tooltip/assets/bootstrap.css";
import { UpdownIo } from "./UpdownIo";

type DashboardProps = { report: DashLordReport };

const remap = (value: number, x1: number, y1: number, x2: number, y2: number) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const scoreToGrade = (score: number) => {
  const grades = "A,B,C,D,E,F".split(",");

  const newGrade = Math.min(
    grades.length - 1,
    Math.floor(remap(score, 0, 1, 0, 6))
  );

  return grades[newGrade];
};

const IconUnknown = () => <Slash size={20} />;

const getGradeTrackers = (count: number) => {
  return count > 10 ? "F" : count > 2 ? "C" : count > 0 ? "B" : "A";
};

const getGradeCookies = (count: number) => {
  return count > 10
    ? "F"
    : count > 5
    ? "E"
    : count > 2
    ? "C"
    : count > 0
    ? "B"
    : "A";
};

const getNucleiGrade = (events: NucleiReportEntry[]) => {
  return events.filter(
    (n) => n.info.severity === "critical" || n.info.severity === "high"
  ).length
    ? "F"
    : events.length
    ? "B"
    : "A";
};

const getOwaspGrade = (owaspAlerts: ZapReportSiteAlert[]) => {
  const maxSeverity = Math.max(
    ...owaspAlerts.map((o) => parseInt(o.riskcode) || 0)
  );

  return maxSeverity > 3
    ? "F"
    : maxSeverity > 2
    ? "D"
    : maxSeverity > 1
    ? "C"
    : maxSeverity > 0
    ? "B"
    : "A";
};

const getGradeUpdownio = (uptime: number) => {
  return uptime > 0.95 ? "F" : uptime > 0.98 ? "C" : uptime > 0.99 ? "B" : "A";
};

type ColumnHeaderProps = {
  title: string;
  info: string;
};

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, info }) => (
  <th
    className="text-center sticky-top"
    style={{ background: "var(--white)", top: 30 }}
  >
    <Tooltip
      placement="bottom"
      trigger={["hover"]}
      overlay={<span>{info}</span>}
    >
      <span style={{ fontSize: "0.9em" }}>
        {title}
        <br />
        <Info size={16} style={{ cursor: "pointer" }} />
      </span>
    </Tooltip>
  </th>
);

type BadgeProps = { report: UrlReport };
type LightHouseBadgeProps = BadgeProps & {
  category: LighthouseReportCategoryKey;
};

const LightHouseBadge: React.FC<LightHouseBadgeProps> = ({
  report,
  category,
}) => {
  const lhrCategories = report.lhr && report.lhr.categories;
  if (!lhrCategories) {
    return <IconUnknown />;
  }
  const value =
    lhrCategories &&
    lhrCategories[category] &&
    (lhrCategories[category].score as number);
  return (
    <Grade
      small
      grade={scoreToGrade(1 - value)}
      label={(value * 100).toFixed() + " %"}
    />
  );
};

const SSLBadge: React.FC<BadgeProps> = ({ report }) => {
  const overallGrade =
    report.testssl &&
    report.testssl.find((entry) => entry.id === "overall_grade");
  const value = overallGrade && overallGrade.finding;
  if (!value) {
    return <IconUnknown />;
  }
  return <Grade small grade={value} />;
};

const HTTPBadge: React.FC<BadgeProps> = ({ report }) => {
  const value = report.http && report.http.grade;
  if (!value) {
    return <IconUnknown />;
  }
  return <Grade small grade={value} />;
};

const ZapBadge: React.FC<BadgeProps> = ({ report }) => {
  const owaspAlerts =
    (report.zap &&
      report.zap.site &&
      report.zap.site.flatMap((site) =>
        site.alerts.filter((a) => a.riskcode !== "0")
      )) ||
    [];
  const owaspCount = report.zap && owaspAlerts.length;
  const owaspGrade = getOwaspGrade(owaspAlerts);

  if (!owaspGrade) {
    return <IconUnknown />;
  }
  return <Grade small grade={owaspGrade} label={owaspCount} />;
};

const ThirdPartiesTrackersBadge: React.FC<BadgeProps> = ({ report }) => {
  if (!report.thirdparties) {
    return <IconUnknown />;
  }
  const trackersCount =
    (report.thirdparties &&
      report.thirdparties.trackers &&
      report.thirdparties.trackers.length) ||
    0;
  const trackersGrade = getGradeTrackers(trackersCount);
  return <Grade small grade={trackersGrade} label={trackersCount} />;
};

const ThirdPartiesCookiesBadge: React.FC<BadgeProps> = ({ report }) => {
  if (!report.thirdparties) {
    return <IconUnknown />;
  }
  const cookiesCount =
    (report.thirdparties &&
      report.thirdparties.cookies &&
      report.thirdparties.cookies.length) ||
    0;
  const cookiesGrade = getGradeCookies(cookiesCount);
  return <Grade small grade={cookiesGrade} label={cookiesCount} />;
};

const NucleiBadge: React.FC<BadgeProps> = ({ report }) => {
  if (!report.nuclei) {
    return <IconUnknown />;
  }

  // NUCLEI
  const nucleiCount = report.nuclei && report.nuclei.length;
  const nucleiGrade = report.nuclei && getNucleiGrade(report.nuclei);

  return <Grade small grade={nucleiGrade} label={nucleiCount} />
}

const UpDownIoBadge: React.FC<BadgeProps> = ({ report }) => {
  if (!report.updownio) {
    return <IconUnknown />
  }
  const updownio = report.updownio && report.updownio.uptime;
  const updownioGrade = getGradeUpdownio(updownio);
  return <Grade
    small
    grade={updownioGrade}
    label={(updownio * 100).toFixed() + " %"}
  />
}

export const Dashboard: React.FC<DashboardProps> = ({ report }) => {
  const sortedReport = report.sort(sortByKey("url"));

  return (
    <Table striped bordered hover>
      <thead >
        <tr >
          <th className="sticky-top" style={{ background: "var(--white)", top: 30 }}>url</th>
          {isToolEnabled('lighthouse') && <ColumnHeader
            title="Accessibilité"
            info="Bonnes pratiques en matière d'accessibilité web"
          />}
          {isToolEnabled('lighthouse') && <ColumnHeader
            title="Performance"
            info="Performances de chargement des pages web"
          />}
          {isToolEnabled('lighthouse') && <ColumnHeader
            title="SEO"
            info="Bonnes pratiques en matière de référencement naturel"
          />}
          {isToolEnabled('testssl') && <ColumnHeader
            title="SSL"
            info="Niveau de sécurité du certificat SSL"
          />}
          {isToolEnabled('http') && <ColumnHeader
            title="HTTP"
            info="Bonnes pratiques de configuration HTTP" />}
          {isToolEnabled('updownio') && <ColumnHeader
            title="Updown.io"
            info="Temps de réponse"
          />}
          {isToolEnabled('zap') && <ColumnHeader
            title="OWASP"
            info="Bonnes pratiques de sécurité OWASP"
          />}
          {isToolEnabled('thirdparties') && <ColumnHeader
            title="Trackers"
            info="Nombre de scripts externes présents"
          />}
          {isToolEnabled('thirdparties') && <ColumnHeader title="Cookies" info="Nombre de cookies présents" />}
          {isToolEnabled('nuclei') && <ColumnHeader title="Nuclei" info="Erreurs de configuration" />}
        </tr>
      </thead>
      <tbody>
        {sortedReport.map((urlReport) => {
          return (
            <tr key={urlReport.url}>
              <td>
                <Link to={`/url/${encodeURIComponent(urlReport.url)}`}>
                  <Search size={16} />
                  &nbsp;{smallUrl(urlReport.url)}
                </Link>
              </td>
              {isToolEnabled('lighthouse') && <td className="text-center">
                <LightHouseBadge report={urlReport} category="accessibility" />
              </td>}
              {isToolEnabled('lighthouse') && <td className="text-center">
                <LightHouseBadge report={urlReport} category="performance" />
              </td>}
              {isToolEnabled('lighthouse') && <td className="text-center">
                <LightHouseBadge report={urlReport} category="seo" />
              </td>}
              {isToolEnabled('testssl') && <td className="text-center">
                <SSLBadge report={urlReport} />
              </td>}
              {isToolEnabled('http') && <td className="text-center">
                <HTTPBadge report={urlReport} />
              </td>}
              {isToolEnabled('updownio') && <td className="text-center">
                <UpDownIoBadge report={urlReport} />
              </td>}
              {isToolEnabled('zap') && <td className="text-center">
                <ZapBadge report={urlReport} />
              </td>}
              {isToolEnabled('thirdparties') && <td className="text-center">
                <ThirdPartiesTrackersBadge report={urlReport} />
              </td>}
              {isToolEnabled('thirdparties') && <td className="text-center">
                <ThirdPartiesCookiesBadge report={urlReport} />
              </td>}
              {isToolEnabled('nuclei') && <td className="text-center">
                <NucleiBadge report={urlReport} />
              </td>}
            </tr>
          );
        })}
      </tbody >
    </Table >
  );
};
