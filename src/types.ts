export interface RegionData {
  region: string;
  female: number;
  male: number;
  total: number;
}

export interface FunctionalGroupData {
  group: string;
  female: number;
  male: number;
  total: number;
}

export interface VenueSurveyData {
  venue: string;
  count: number;
  percentage: number;
}

export interface SeminarSurveyData {
  intention: string;
  count: number;
  percentage: number;
}

export interface TransportData {
  mode: string;
  count: number;
  percentage: number;
}

export interface MealData {
  date: string;
  dayOfWeek: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  total: number;
  note?: string;
}

export interface RoomRecord {
  id: string;
  roomNumber?: string;
  roommates: string[];
  person1: string;
  person2?: string;
  extraPeople?: string[];
  venue: '東' | '花';
  venueName: string;
  gender: '男' | '女';
  stay915: boolean;
  stay916: boolean;
  stay917: boolean;
}

export interface PersonLodgingRecord {
  date: '9/15' | '9/16' | '9/17';
  name: string;
  assignedRoommate: string;
  gender: '男' | '女';
  count: number;
}

export interface DailyLodgingSummary {
  date: string;
  dayName: string;
  taitung: number;
  hualien: number;
  total: number;
  taitungMale: number;
  taitungFemale: number;
  hualienMale: number;
  hualienFemale: number;
  taitungDelta?: string;
  hualienDelta?: string;
}

export interface ParticipantRoster {
  id: string;
  name: string;
  gender: '男' | '女';
  region: string;
  functionalGroup: string;
  venue: string;
  seminarAttendance: string;
  transport: string;
  roommatePreference: string;
  stay915: boolean;
  stay916: boolean;
  stay917: boolean;
  lodgingVenue?: '東' | '花' | '';
}

export interface DashboardDataset {
  summary: {
    totalParticipants: number;
    maleCount: number;
    femaleCount: number;
    totalMealsPlanned: number;
    maxDailyLodging: number;
    taitungMainCount: number;
    hualienSubCount: number;
    seminarOnlyCount: number;
  };
  regionStats: RegionData[];
  functionStats: FunctionalGroupData[];
  venueStats: VenueSurveyData[];
  seminarStats: SeminarSurveyData[];
  transportStats: TransportData[];
  mealStats: MealData[];
  dailyLodgingStats: DailyLodgingSummary[];
  roomList: RoomRecord[];
  lodging915: PersonLodgingRecord[];
  lodging916: PersonLodgingRecord[];
  lodging917: PersonLodgingRecord[];
  participants: ParticipantRoster[];
  lastUpdated: string;
  sourceUrl: string;
}

export type SessionFilter = 'all' | 'taitung' | 'hualien' | 'seminar';
