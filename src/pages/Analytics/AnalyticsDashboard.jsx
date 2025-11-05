import React, { useEffect, useState } from 'react';
import { getAnalyticsData } from '../../api/mockAnalytics';
import { Pie, Column, Line, Funnel, WordCloud } from '@ant-design/charts';

const KPICard = ({ title, value }) => (
  <div className="p-4 bg-white rounded-lg shadow">
    <p className="text-xs font-medium text-gray-500 truncate">{title}</p>
    <p className="mt-1 text-3xl font-semibold text-gray-800">{value}</p>
  </div>
);

const ChartContainer = ({ title, children }) => (
  <div className="p-4 bg-white rounded-lg shadow h-full flex flex-col">
    <h3 className="text-md font-semibold mb-2 text-gray-700">{title}</h3>
    <div className="flex-grow">{children}</div>
  </div>
);

export function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Could not load analytics data.</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Platform Analytics</h1>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Jobs" value={data.kpis.totalJobs} />
        <KPICard title="Total Applications" value={data.kpis.totalApplications} />
        <KPICard title="Total Students" value={data.kpis.totalStudents} />
        <KPICard title="Total Companies" value={data.kpis.totalCompanies} />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Hiring Funnel">
          <Funnel data={data.funnel} xField='stage' yField='count' legend={false} />
        </ChartContainer>
        <ChartContainer title="Jobs by Location">
          <Pie data={data.jobsByLocation} angleField='value' colorField='type' radius={0.8} innerRadius={0.6} label={{ content: '{value}' }} />
        </ChartContainer>
        <ChartContainer title="Placements by Department">
          <Column data={data.placementsByDept} xField='type' yField='value' seriesField='type' legend={false} />
        </ChartContainer>
        <ChartContainer title="Top Skills in Demand">
           <WordCloud data={data.topSkills} wordField="name" weightField="value" colorField="name" />
        </ChartContainer>
      </div>
    </div>
  );
}
