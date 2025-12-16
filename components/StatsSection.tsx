import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import AnimateOnScroll from './AnimateOnScroll';

// Mock data to simulate coding activity or project stats
const activityData = [
  { month: 'Jan', commits: 45, hours: 120 },
  { month: 'Feb', commits: 52, hours: 130 },
  { month: 'Mar', commits: 38, hours: 90 },
  { month: 'Apr', commits: 65, hours: 150 },
  { month: 'May', commits: 48, hours: 110 },
  { month: 'Jun', commits: 70, hours: 170 },
  { month: 'Jul', commits: 60, hours: 140 },
  { month: 'Aug', commits: 85, hours: 190 },
  { month: 'Sep', commits: 75, hours: 160 },
  { month: 'Oct', commits: 68, hours: 145 },
  { month: 'Nov', commits: 90, hours: 210 },
  { month: 'Dec', commits: 82, hours: 185 },
];

const StatsSection: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Basic check for theme, similar to App.tsx logic, though React context would be better
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkTheme();
    // Create an observer to watch for class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Colors based on CSS variables (hardcoded hexes that match the variables for Recharts)
  const accentColor = '#D9C06C';
  const gridColor = isDark ? '#444444' : '#dddddd';
  const textColor = isDark ? '#a0a0a0' : '#555555';
  const tooltipBg = isDark ? '#1e1e1e' : '#FFFFFF';
  const tooltipBorder = isDark ? '#444444' : '#dddddd';

  return (
    <section id="activity" className="py-12 sm:py-20">
      <div className="text-center mb-12">
        <AnimateOnScroll>
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            <span className="relative inline-block pb-3">
              Coding Activity
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-accent rounded-full"></span>
            </span>
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={150}>
          <p className="mt-4 text-md text-secondary">
            A visual overview of my development contributions and coding hours over the last year.
          </p>
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll delay={200}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-surface p-6 rounded-lg shadow-lg border border-border">
                    <h3 className="text-lg font-semibold text-primary mb-1">Total Contributions</h3>
                    <p className="text-4xl font-bold text-accent">778</p>
                    <p className="text-sm text-secondary mt-2">+12% from last year</p>
                </div>
                <div className="bg-surface p-6 rounded-lg shadow-lg border border-border">
                    <h3 className="text-lg font-semibold text-primary mb-1">Hours Coded</h3>
                    <p className="text-4xl font-bold text-accent">1,800+</p>
                    <p className="text-sm text-secondary mt-2">Across 15+ projects</p>
                </div>
                 <div className="bg-surface p-6 rounded-lg shadow-lg border border-border">
                    <h3 className="text-lg font-semibold text-primary mb-1">Primary Stack</h3>
                     <div className="flex flex-wrap gap-2 mt-3">
                        {['React', 'Python', 'C++', 'ROS'].map(tech => (
                             <span key={tech} className="bg-accent/20 text-primary text-xs font-semibold px-2 py-1 rounded-full border border-accent/50">{tech}</span>
                        ))}
                     </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="lg:col-span-3 bg-surface p-4 sm:p-6 rounded-lg shadow-lg border border-border min-h-[400px] flex flex-col">
                <h3 className="text-xl font-bold text-primary mb-6 pl-2">Annual Activity Overview</h3>
                <div className="flex-grow w-full h-[300px] sm:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={activityData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis 
                                dataKey="month" 
                                stroke={textColor} 
                                tick={{fill: textColor, fontSize: 12}}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                stroke={textColor} 
                                tick={{fill: textColor, fontSize: 12}}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: tooltipBg, 
                                    borderColor: tooltipBorder, 
                                    borderRadius: '8px', 
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    color: textColor
                                }}
                                itemStyle={{ color: textColor }}
                                labelStyle={{ color: textColor, fontWeight: 'bold' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="hours" 
                                stroke={accentColor} 
                                fillOpacity={1} 
                                fill="url(#colorHours)" 
                                name="Hours Coded"
                            />
                            <Area 
                                type="monotone" 
                                dataKey="commits" 
                                stroke="#555555" 
                                strokeDasharray="5 5"
                                fillOpacity={0} 
                                name="Commits"
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default StatsSection;