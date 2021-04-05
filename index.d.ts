type UrlConfig = {
  url: string;
  category?: string;
  title?: string;
  tags?: string[];
};
 
type DashlordTool =
  | "http"
  | "lighthouse"
  | "nuclei"
  | "testssl"
  | "thirdparties"
<<<<<<< HEAD
  | "updownio"
=======
>>>>>>> feat: handle config.tools
  | "wappalyzer"
  | "zap";

type DashlordConfig = {
  title: string;
  tools?: DashlordTool[];
  urls: UrlConfig[];
} 

type UrlConfig = {
  url: string;
  category?: string;
  title?: string;
  tags?: string[];
};

type LighthouseReportCategory = {
  title: string;
  id: string;
  score: number|null;
  description?: string;
};

type LighthouseReportCategoryKey =
  | "performance"
  | "accessibility"
  | "best-practices"
  | "seo"
  | "pwa";

type LighthouseReportCategories = Record<
  LighthouseReportCategoryKey,
  LighthouseReportCategory
>;

type LighthouseReportAudits = {
  metrics: {
      details?: {
          items?: any[]
      }
  };
  diagnostics: {
      details?: {
          items?: any[]
      }
  }
}

type LighthouseReport = {
  requestedUrl: string;
  finalUrl: string;
  runWarnings: string[];
  categories: LighthouseReportCategories
  fetchTime: string
  audits: LighthouseReportAudits
}

type SslTestReportEntry = {
  id: string;
  ip: string;
  port: string;
  severity: string;
  finding: string;
};

type SslTestReport = SslTestReportEntry[]

type HttpTestReport = {
  name: string
  score_description: string
  pass: boolean
  score_modifier: number
}

type HttpReport = {
  details: Record<any, HttpTestReport>
  url: string
  grade: string
}

type ZapReportSiteAlert = {
  name: string;
  riskcode: string;
  confidence: string;
  riskdesc: string;
  desc: string;
};

type ZapReportSite = {
  "@name": string;
  "@host": string;
  alerts: ZapReportSiteAlert[];
};

type ZapReport = {
  "@version": string;
  "@generated": string;
  site: ZapReportSite[];
};

type NucleiReportInfo = {
  severity: string;
  name: string;
};

type NucleiReportEntry = {
  request?: string;
  response?: string;
  info: NucleiReportInfo;
  type: string;
  ip: string;
  host: string;
  matched: string;
  templateID: string;
  matcher_name?: string
};

type NucleiReport = NucleiReportEntry[];

type ThirdPartyTracker = {
  type: string
  url: string
  details?: {
      id: string
      message?: string
  }
}

type ThirdPartyCookie = {
  name: string
  value: string
  domain: string
  path: string
  expires: number
  size: number
  httpOnly: boolean
  secure: boolean
  session: boolean
  sameParty: boolean
  sourceScheme: string
  sourcePort: number
}

type GeoIpEndpoint = {
  country?: {
      iso_code: string
      names: {
          fr: string
      }
  }
  city?: {
      names: {
          fr?: string
      }
  }
}

type ThirdPartyEndpoint = {
  hostname: string
  ip?: string | null
  geoip: GeoIpEndpoint| null
}

type ThirdPartiesReportCookies = ThirdPartyCookie[]
type ThirdPartiesReportTrackers = ThirdPartyTracker[]
type ThirdPartiesReportEndpoints = ThirdPartyEndpoint[]

type ThirdPartiesReport = {
  cookies: ThirdPartiesReportCookies
  trackers: ThirdPartiesReportTrackers
  endpoints: ThirdPartiesReportEndpoints
}

type WappalyzerCategory = {
  id: number
  slug: string
  name: string
}

type WappalyzerTechnology = {
  slug: string
  name: string
  confidence: number
  website: string
  categories: WappalyzerCategory[]
}

type WappalyzerUrl = {
  status: number;
  error?: string
}

type WappalyzerReport = {
  urls: Record<string, WappalyzerUrl|undefined>
  technologies: WappalyzerTechnology[]
}

type UpDownReport = {
  uptime: number
}

type UrlReport = UrlConfig & {
  lhr?: LighthouseReport | null;
  testssl?: SslTestReport | null;
  http?: HttpReport | null;
  nuclei?: NucleiReport | null;
  thirdparties?: ThirdPartiesReport | null;
  zap?: ZapReport | null;
  wappalyzer?: WappalyzerReport | null;
  updownio?: UpDownReport | null
}

type DashLordReport = UrlReport[]


