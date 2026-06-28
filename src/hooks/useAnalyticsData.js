import { useRef, useEffect } from 'react';

export function useAnalyticsData(snapshot) {
  const resultRef = useRef(null);

  useEffect(() => {
    // We compute it once. To strictly follow "never recompute while overlay is open".
    if (!resultRef.current && snapshot) {
      computeData(snapshot, resultRef);
    }
  }, [snapshot]);

  if (!resultRef.current && snapshot) {
    computeData(snapshot, resultRef);
  }

  return resultRef.current || {};
}

function computeData(snapshot, resultRef) {
  const statusCounts = { Active: 0, Completed: 0, Planned: 0, Failed: 0 };
  const industryMap = new Map();
  const yearMap = new Map();
  const points = [];
  const autoMap = new Map();
  
  let poolSize = snapshot.length;
  let stride = poolSize > 2000 ? Math.floor(poolSize / 2000) : 1;

  snapshot.forEach((row, idx) => {
    if (row.project_status === 'Active' || row.project_status === 'In Progress') {
      statusCounts.Active++;
    } else if (row.project_status === 'Completed') {
      statusCounts.Completed++;
    } else if (row.project_status === 'Failed') {
      statusCounts.Failed++;
    } else {
      statusCounts.Planned++;
    }

    if (row.industry) {
      if (!industryMap.has(row.industry)) {
        industryMap.set(row.industry, { sumRoi: 0, count: 0 });
      }
      const ind = industryMap.get(row.industry);
      ind.sumRoi += (row.roi_percent || 0);
      ind.count++;
    }

    if (row.start_date) {
      let year;
      if (row.start_date.includes('/')) {
         const parts = row.start_date.split('/');
         if (parts.length === 3) year = parts[2];
      } else if (row.start_date.includes('-')) {
         year = row.start_date.split('-')[0];
      }
      if (year && year.length === 4) {
        const y = parseInt(year, 10);
        if (!yearMap.has(y)) yearMap.set(y, 0);
        yearMap.set(y, yearMap.get(y) + (row.annual_savings_usd || 0));
      }
    }

    if (row.budget_usd > 0 && row.roi_percent !== null && idx % stride === 0) {
      points.push({ x: row.budget_usd, y: row.roi_percent });
    }

    if (row.automation_type) {
      if (!autoMap.has(row.automation_type)) {
        autoMap.set(row.automation_type, { 
          sumRoi: 0, sumSavings: 0, sumHours: 0, count: 0 
        });
      }
      const am = autoMap.get(row.automation_type);
      am.sumRoi += (row.roi_percent || 0);
      am.sumSavings += (row.annual_savings_usd || 0);
      am.sumHours += (row.employee_hours_saved || 0);
      am.count++;
    }
  });

  const statusDistribution = {
    labels: ['Active', 'Completed', 'Planned', 'Failed'],
    counts: [statusCounts.Active, statusCounts.Completed, statusCounts.Planned, statusCounts.Failed]
  };

  const industryList = Array.from(industryMap.entries()).map(([name, data]) => {
    return { name, avgRoi: data.sumRoi / data.count };
  });
  industryList.sort((a, b) => b.avgRoi - a.avgRoi);
  const top10Industries = industryList.slice(0, 10);

  const industryROIMap = {
    labels: top10Industries.map(i => i.name),
    data: top10Industries.map(i => i.avgRoi)
  };

  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);
  let runningSum = 0;
  const savingsByMonth = {
    labels: sortedYears,
    data: sortedYears.map(y => {
      runningSum += yearMap.get(y);
      return runningSum;
    })
  };

  const roiVsBudgetPoints = points;

  const autoList = Array.from(autoMap.entries()).map(([name, data]) => {
    return {
      name,
      avgRoi: data.sumRoi / data.count,
      avgSavings: data.sumSavings / data.count,
      avgHours: data.sumHours / data.count,
      count: data.count
    };
  });
  autoList.sort((a, b) => b.count - a.count);
  const topAuto = autoList.slice(0, 10);
  
  let maxSavings = 0, maxHours = 0, maxRoi = 0;
  topAuto.forEach(a => {
    if (a.avgSavings > maxSavings) maxSavings = a.avgSavings;
    if (a.avgHours > maxHours) maxHours = a.avgHours;
    if (a.avgRoi > maxRoi) maxRoi = a.avgRoi;
  });

  const automationTypeScores = {
    labels: topAuto.map(a => a.name),
    roi: topAuto.map(a => maxRoi ? (a.avgRoi / maxRoi) * 100 : 0),
    savings: topAuto.map(a => maxSavings ? (a.avgSavings / maxSavings) * 100 : 0),
    hours: topAuto.map(a => maxHours ? (a.avgHours / maxHours) * 100 : 0)
  };
  
  let totalSavings = 0;
  let totalRoi = 0;
  let totalRoiCount = 0;
  
  snapshot.forEach(r => {
    totalSavings += (r.annual_savings_usd || 0);
    if (r.roi_percent !== null && r.roi_percent !== undefined) {
       totalRoi += r.roi_percent;
       totalRoiCount++;
    }
  });
  
  let mostCommonInd = '';
  const indByCount = Array.from(industryMap.entries()).map(([name, data]) => ({name, count: data.count}));
  indByCount.sort((a,b) => b.count - a.count);
  if (indByCount.length > 0) mostCommonInd = indByCount[0].name;

  resultRef.current = {
    statusDistribution,
    industryROIMap,
    savingsByMonth,
    roiVsBudgetPoints,
    automationTypeScores,
    summary: {
      totalProjects: poolSize,
      avgRoi: totalRoiCount ? (totalRoi / totalRoiCount) : 0,
      totalSavings,
      mostCommonIndustry: mostCommonInd
    }
  };
}
