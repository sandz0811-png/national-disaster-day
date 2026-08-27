import { DashboardDataset, DailyLodgingSummary, SessionFilter } from '../types';

export function filterDatasetBySession(
  rawDataset: DashboardDataset,
  session: SessionFilter
): DashboardDataset {
  if (session === 'all') {
    return rawDataset;
  }

  // 1. Filter participants
  const filteredParticipants = rawDataset.participants.filter(p => {
    if (session === 'taitung') return p.venue.includes('臺東');
    if (session === 'hualien') return p.venue.includes('花蓮');
    if (session === 'seminar') return p.venue.includes('座談') || (!p.venue.includes('臺東') && !p.venue.includes('花蓮'));
    return true;
  });

  const totalParticipants = filteredParticipants.length;
  const maleCount = filteredParticipants.filter(p => p.gender === '男').length;
  const femaleCount = filteredParticipants.filter(p => p.gender === '女').length;
  const taitungMainCount = filteredParticipants.filter(p => p.venue.includes('臺東')).length;
  const hualienSubCount = filteredParticipants.filter(p => p.venue.includes('花蓮')).length;
  const seminarOnlyCount = filteredParticipants.filter(p => p.venue.includes('座談') || (!p.venue.includes('臺東') && !p.venue.includes('花蓮'))).length;

  const participantNames = new Set(filteredParticipants.map(p => p.name));

  // 2. Region Stats
  const regionMap = new Map<string, { female: number; male: number; total: number }>();
  filteredParticipants.forEach(p => {
    const existing = regionMap.get(p.region) || { female: 0, male: 0, total: 0 };
    if (p.gender === '女') existing.female += 1;
    else existing.male += 1;
    existing.total += 1;
    regionMap.set(p.region, existing);
  });

  const regionStats = Array.from(regionMap.entries())
    .map(([region, stat]) => ({
      region,
      female: stat.female,
      male: stat.male,
      total: stat.total,
    }))
    .sort((a, b) => b.total - a.total);

  // 3. Functional Group Stats
  const groupMap = new Map<string, { female: number; male: number; total: number }>();
  filteredParticipants.forEach(p => {
    const existing = groupMap.get(p.functionalGroup) || { female: 0, male: 0, total: 0 };
    if (p.gender === '女') existing.female += 1;
    else existing.male += 1;
    existing.total += 1;
    groupMap.set(p.functionalGroup, existing);
  });

  const functionStats = Array.from(groupMap.entries())
    .map(([group, stat]) => ({
      group,
      female: stat.female,
      male: stat.male,
      total: stat.total,
    }))
    .sort((a, b) => b.total - a.total);

  // 4. Venue Stats
  const venueMap = new Map<string, number>();
  filteredParticipants.forEach(p => {
    venueMap.set(p.venue, (venueMap.get(p.venue) || 0) + 1);
  });
  const venueStats = Array.from(venueMap.entries())
    .map(([venue, count]) => ({
      venue,
      count,
      percentage: totalParticipants > 0 ? Number(((count / totalParticipants) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 5. Seminar Stats
  const seminarMap = new Map<string, number>();
  filteredParticipants.forEach(p => {
    seminarMap.set(p.seminarAttendance, (seminarMap.get(p.seminarAttendance) || 0) + 1);
  });
  const seminarStats = Array.from(seminarMap.entries())
    .map(([intention, count]) => ({
      intention,
      count,
      percentage: totalParticipants > 0 ? Number(((count / totalParticipants) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 6. Transport Stats
  const transportMap = new Map<string, number>();
  filteredParticipants.forEach(p => {
    transportMap.set(p.transport, (transportMap.get(p.transport) || 0) + 1);
  });
  const transportStats = Array.from(transportMap.entries())
    .map(([mode, count]) => ({
      mode,
      count,
      percentage: totalParticipants > 0 ? Number(((count / totalParticipants) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 7. Room List & Lodging
  const filteredRoomList = rawDataset.roomList.filter(room => {
    if (session === 'taitung') return room.venue === '東';
    if (session === 'hualien') return room.venue === '花';
    return participantNames.has(room.person1) || (room.person2 && participantNames.has(room.person2));
  });

  const lodging915 = rawDataset.lodging915.filter(l => participantNames.has(l.name));
  const lodging916 = rawDataset.lodging916.filter(l => participantNames.has(l.name));
  const lodging917 = rawDataset.lodging917.filter(l => participantNames.has(l.name));

  // Daily lodging summary calculation
  const countLodging = (dateList: typeof lodging915) => {
    let taitung = 0;
    let hualien = 0;
    let taitungMale = 0;
    let taitungFemale = 0;
    let hualienMale = 0;
    let hualienFemale = 0;

    dateList.forEach(item => {
      const p = filteredParticipants.find(part => part.name === item.name);
      const venue = p?.lodgingVenue || (p?.venue.includes('東') ? '東' : '花');
      if (venue === '東') {
        taitung += 1;
        if (item.gender === '男') taitungMale += 1;
        else taitungFemale += 1;
      } else {
        hualien += 1;
        if (item.gender === '男') hualienMale += 1;
        else hualienFemale += 1;
      }
    });

    return {
      taitung,
      hualien,
      total: taitung + hualien,
      taitungMale,
      taitungFemale,
      hualienMale,
      hualienFemale,
    };
  };

  const l915 = countLodging(lodging915);
  const l916 = countLodging(lodging916);
  const l917 = countLodging(lodging917);

  const dailyLodgingStats: DailyLodgingSummary[] = [
    {
      date: '9/15',
      dayName: '週二 (提前抵達)',
      ...l915,
      taitungDelta: '基準日',
      hualienDelta: '基準日',
    },
    {
      date: '9/16',
      dayName: '週三 (座談前夕)',
      ...l916,
      taitungDelta: l916.taitung >= l915.taitung ? `+${l916.taitung - l915.taitung}` : `${l916.taitung - l915.taitung}`,
      hualienDelta: l916.hualien >= l915.hualien ? `+${l916.hualien - l915.hualien}` : `${l916.hualien - l915.hualien}`,
    },
    {
      date: '9/17',
      dayName: '週四 (主演練當晚)',
      ...l917,
      taitungDelta: l917.taitung >= l916.taitung ? `+${l917.taitung - l916.taitung}` : `${l917.taitung - l916.taitung}`,
      hualienDelta: l917.hualien >= l916.hualien ? `+${l917.hualien - l916.hualien}` : `${l917.hualien - l916.hualien}`,
    },
  ];

  const maxDailyLodging = Math.max(l915.total, l916.total, l917.total);

  // 8. Meal Stats calculation
  const stay915Count = filteredParticipants.filter(p => p.stay915).length;
  const stay916Count = filteredParticipants.filter(p => p.stay916).length;
  const stay917Count = filteredParticipants.filter(p => p.stay917).length;

  const m915 = {
    date: '9/15',
    dayOfWeek: '週二',
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    total: 0,
    note: '提前一日抵達籌備 (自理或視現場需求)',
  };

  const m916Breakfast = stay915Count;
  const m916Lunch = Math.round((rawDataset.mealStats[1].lunch / rawDataset.summary.totalParticipants) * totalParticipants);
  const m916Dinner = stay916Count;
  const m916 = {
    date: '9/16',
    dayOfWeek: '週三',
    breakfast: m916Breakfast,
    lunch: m916Lunch,
    dinner: m916Dinner,
    total: m916Breakfast + m916Lunch + m916Dinner,
    note: '座談與彩排日，午晚餐需求',
  };

  const m917Breakfast = stay916Count;
  const m917Lunch = session === 'seminar' ? 0 : totalParticipants;
  const m917 = {
    date: '9/17',
    dayOfWeek: '週四',
    breakfast: m917Breakfast,
    lunch: m917Lunch,
    dinner: 0,
    total: m917Breakfast + m917Lunch,
    note: '國家防災日主演練日 (晚餐無大會供餐)',
  };

  const m918Breakfast = stay917Count;
  const m918Lunch = session === 'seminar' ? 0 : (stay917Count > 0 ? stay917Count : Math.round(totalParticipants * 0.8));
  const m918 = {
    date: '9/18',
    dayOfWeek: '週五',
    breakfast: m918Breakfast,
    lunch: m918Lunch,
    dinner: 0,
    total: m918Breakfast + m918Lunch,
    note: '收尾檢討與賦歸',
  };

  const mealStats = [m915, m916, m917, m918];
  const totalMealsPlanned = mealStats.reduce((sum, m) => sum + m.total, 0);

  return {
    ...rawDataset,
    summary: {
      totalParticipants,
      maleCount,
      femaleCount,
      totalMealsPlanned,
      maxDailyLodging,
      taitungMainCount,
      hualienSubCount,
      seminarOnlyCount,
    },
    regionStats,
    functionStats,
    venueStats,
    seminarStats,
    transportStats,
    mealStats,
    dailyLodgingStats,
    roomList: filteredRoomList,
    lodging915,
    lodging916,
    lodging917,
    participants: filteredParticipants,
  };
}
