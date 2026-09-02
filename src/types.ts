export type EraId = 'brand-new-day' | 'the-gauntlet' | 'big-time-superior' | 'spider-verse' | 'classic-foundations';

export interface Era {
  id: EraId;
  name: string;
  tagline: string;
  yearRange: string;
  description: string;
  totalIssuesCount: number;
  highlightCover: string;
  colorTheme: string;
}

export type ArcImportance = 'essential' | 'major' | 'core' | 'climax';

export interface StoryArc {
  id: string;
  eraId: EraId;
  title: string;
  slug: string;
  subtitle: string;
  issueRange: string;
  year: string;
  summary: string;
  synopsisExpanded: string;
  keyCreators: {
    writers: string[];
    artists: string[];
  };
  keyVillains: string[];
  keyAllies: string[];
  importance: ArcImportance;
  accentColor: string;
  iconName?: string;
  coverImage?: string;
  readingOrderStart: number;
}

export type IssueImportance = 'essential' | 'major' | 'tie-in' | 'one-shot' | 'debut' | 'core' | 'climax';
export type IssueType = 'main' | 'tie-in' | 'annual' | 'one-shot' | 'fcbd';
export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Extreme' | 'Omega';

export interface ComicIssue {
  id: string;
  readingOrder: number;
  arcId: string;
  seriesName: string;
  issueNumber: string;
  title: string;
  coverDate: string;
  releaseDate: string;
  writers: string[];
  artists: string[];
  synopsis: string;
  keyCharacters: string[];
  keyVillains: string[];
  firstAppearances: string[];
  importance: IssueImportance;
  type: IssueType;
  threatLevel: ThreatLevel;
  trivia?: string;
  readingAdvice?: string;
  coverGradient: string;
  badgeLabel?: string;
}

export interface VillainProfile {
  id: string;
  name: string;
  alias: string;
  firstAppearedIn: string;
  firstIssueId: string;
  threatLevel: ThreatLevel;
  bio: string;
  powerDescription: string;
  keyArcs: string[];
  imageAvatar: string;
  colorHex: string;
}

export interface UserProgressItem {
  issueId: string;
  isRead: boolean;
  isOwned: boolean;
  rating: number; // 0 to 5
  readingFormat: 'digital' | 'floppy' | 'trade' | 'omnibus';
  notes: string;
  readAt?: string | null;
  dateRead?: string;
}

export type UserProgressMap = Record<string, UserProgressItem>;

export interface FilterState {
  searchQuery: string;
  selectedEraId?: EraId | 'all';
  selectedArcId: string | 'all';
  selectedVillain: string | 'all';
  selectedCharacter: string | 'all';
  selectedSeries?: string | 'all';
  selectedImportance: IssueImportance | 'all';
  readFilter: 'all' | 'read' | 'unread';
  ownedFilter: 'all' | 'owned' | 'unowned';
  sortBy?: 'order' | 'chronological' | 'reverse' | 'rating' | 'threat';
}

export type ActiveTab = 'timeline' | 'arcs' | 'rogues' | 'stats' | 'database' | 'ai-chronologist';

export type SuitThemeId = 'classic' | 'symbiote' | 'iron-spider' | 'big-time' | 'miles-morales' | '2099';

export interface SuitTheme {
  id: SuitThemeId;
  name: string;
  designation: string;
  originEra: string;
  bgGradient: string;
  appBackground: string;
  panelBackground: string;
  cardBackground: string;
  primaryAccent: string;
  secondaryAccent: string;
  textHeading: string;
  textMuted: string;
  borderPrimary: string;
  badgeBg: string;
  webOverlayOpacity: string;
  glowColor: string;
}
