import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Group } from '@visx/group';
import { scaleTime, scaleBand } from '@visx/scale';
import { AxisLeft, AxisTop } from '@visx/axis';
import { format, addMinutes } from 'date-fns';

// Types for transmission data
interface Transmission {
  id: string;
  channel: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  type: 'voice' | 'data' | 'emergency';
  signalStrength: number; // 1-5
}

interface Channel {
  id: string;
  name: string;
  color: string;
  frequency?: string;
}

// Sample data
const sampleChannels: Channel[] = [
  { index: 0, id: 'law1', name: 'Law 1', color: '#166534', frequency: '155.475 MHz' },
  { index: 1, id: 'avd', name: 'AVD Dispatch', color: '#0ea5e9', frequency: '154.445 MHz' },
  { index: 2, id: 'fire1', name: 'Fire Ops 1', color: '#ea580c', frequency: '154.280 MHz' },
  { index: 3, id: 'fire2', name: 'Fire Ops 2', color: '#0ea5e9', frequency: '154.295 MHz' },
  { index: 4, id: 'fire3', name: 'Fire Ops 3', color: '#166534', frequency: '154.310 MHz' },
  { index: 5, id: 'fire4', name: 'Fire Ops 4', color: '#7c3aed', frequency: '154.325 MHz' },
  { index: 6, id: 'training', name: 'Fire Training', color: '#a855f7', frequency: '154.340 MHz' },
  { index: 7, id: 'dispatch', name: 'Fire Dispatch', color: '#581c87', frequency: '154.355 MHz' },
  { index: 8, id: 'parks1', name: 'City Parks 1', color: '#ea580c', frequency: '154.370 MHz' },
  { index: 9, id: 'parks2', name: 'City Parks 2', color: '#166534', frequency: '154.385 MHz' },
];

// Generate sample transmission data
const generateSampleData = (): Transmission[] => {
  const transmissions: Transmission[] = [];
  const baseTime = new Date('2025-08-21T12:00:00');
  
  // Law 1 - frequent short transmissions
  for (let i = 0; i < 100; i++) {
    const start = addMinutes(baseTime, Math.random() * 240);
    const duration = 0.5 + Math.random() * 2;
    transmissions.push({
      id: `law1-${i}`,
      channel: 'law1',
      startTime: start,
      endTime: addMinutes(start, duration),
      duration,
      type: Math.random() > 0.8 ? 'emergency' : 'voice',
      signalStrength: 3 + Math.floor(Math.random() * 3),
    });
  }

  // AVD Dispatch - intermittent transmissions
  for (let i = 0; i < 205; i++) {
    const start = addMinutes(baseTime, Math.random() * 240);
    const duration = 1 + Math.random() * 3;
    transmissions.push({
      id: `avd-${i}`,
      channel: 'avd',
      startTime: start,
      endTime: addMinutes(start, duration),
      duration,
      type: 'voice',
      signalStrength: 4 + Math.floor(Math.random() * 2),
    });
  }

  // Fire Training - short frequent bursts
  for (let i = 0; i < 130; i++) {
    const start = addMinutes(baseTime, Math.random() * 240);
    const duration = 0.2 + Math.random() * 0.8;
    transmissions.push({
      id: `training-${i}`,
      channel: 'training',
      startTime: start,
      endTime: addMinutes(start, duration),
      duration,
      type: 'voice',
      signalStrength: 2 + Math.floor(Math.random() * 3),
    });
  }

  // Fire Dispatch - coordinated with training
  for (let i = 0; i < 325; i++) {
    const start = addMinutes(baseTime, Math.random() * 240);
    const duration = 0.3 + Math.random() * 1.2;
    transmissions.push({
      id: `dispatch-${i}`,
      channel: 'dispatch',
      startTime: start,
      endTime: addMinutes(start, duration),
      duration,
      type: 'voice',
      signalStrength: 3 + Math.floor(Math.random() * 3),
    });
  }

  return transmissions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

const SummaryCard = ({ title, text }) => (
  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
    <div className="font-medium text-gray-700 dark:text-gray-300">
      <span className="font-bold">{title}:</span> {text}
    </div>
  </div>)

export function TransmissionTimeline() {
  const [zoomLevel, setZoomLevel] = useState(23);
  const [visibleRange, setVisibleRange] = useState<{ start: Date; end: Date }>({
    start: new Date('2025-08-21T12:08:23'),
    end: new Date('2025-08-21T16:30:26'),
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const transmissions = useMemo(() => generateSampleData(), []);
  
  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  // Chart dimensions
  const [containerWidth, setContainerWidth] = useState(1200);
  const height = 300;
  const margin = { top: 60, right: 60, bottom: 20, left: 120 };

  // Calculate chart dimensions
  const chartWidth = containerWidth - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Create scales
  const timeScale = scaleTime({
    domain: [visibleRange.start, visibleRange.end],
    range: [0, chartWidth],
  });

  const channelScale = scaleBand({
    domain: sampleChannels.map(ch => ch.id),
    range: [0, chartHeight],
    padding: 0.1,
  });

  // Filter transmissions for visible range
  const visibleTransmissions = transmissions.filter(t => 
    t.startTime >= visibleRange.start && t.endTime <= visibleRange.end
  );

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 100));
    const range = visibleRange.end.getTime() - visibleRange.start.getTime();
    const newRange = range * 0.9;
    const center = new Date(visibleRange.start.getTime() + range / 2);
    setVisibleRange({
      start: new Date(center.getTime() - newRange / 2),
      end: new Date(center.getTime() + newRange / 2),
    });
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 10));
    const range = visibleRange.end.getTime() - visibleRange.start.getTime();
    const newRange = range * 1.1;
    const center = new Date(visibleRange.start.getTime() + range / 2);
    setVisibleRange({
      start: new Date(center.getTime() - newRange / 2),
      end: new Date(center.getTime() + newRange / 2),
    });
  };

  const handleReset = () => {
    setZoomLevel(23);
    setVisibleRange({
      start: new Date('2025-08-21T12:08:23'),
      end: new Date('2025-08-21T16:30:26'),
    });
  };

  const handleShowAll = () => {
    setZoomLevel(100);
    const allTransmissions = transmissions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    setVisibleRange({
      start: allTransmissions[0].startTime,
      end: allTransmissions[allTransmissions.length - 1].endTime,
    });
  };

  const formatTimeRange = () => {
    const startStr = format(visibleRange.start, 'M/d/yyyy, h:mm:ss a');
    const endStr = format(visibleRange.end, 'M/d/yyyy, h:mm:ss a');
    const durationMinutes = Math.round((visibleRange.end.getTime() - visibleRange.start.getTime()) / (1000 * 60));
    return `${startStr} - ${endStr} (${durationMinutes} min)`;
  };

  return (
    <div className="w-full bg-white dark:bg-transparent">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleShowAll}
            className="px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Show All
          </button>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              -
            </button>
            <span className="text-sm font-medium min-w-[40px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              +
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 italic">
          Visible Range: {formatTimeRange()}
        </div>
      </div>

      {/* Timeline Chart */}
       <div className="relative" ref={containerRef}>
         <svg width="100%" height={height}>
          <Group left={margin.left} top={margin.top}>
            {/* Background grid lines */}
            {Array.from({ length: 25 }, (_, i) => {
              const time = addMinutes(visibleRange.start, i * 10);
              const x = timeScale(time);
              return (
                <line
                  key={i}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={chartHeight}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
              );
            })}

            {/* Channel lanes */}
            {sampleChannels.map((channel, i) => {
              const y = channelScale(channel.id);
              const laneHeight = channelScale.bandwidth();
              return (
                <rect
                  key={channel.id}
                  x={0}
                  y={y}
                  width={chartWidth}
                  height={laneHeight}
                  className={i % 2 === 0 ? 'fill-white dark:fill-gray-850' : 'fill-gray-300 dark:fill-gray-700'}
                />
              );
            })}

             {/* Transmission bars */}
             {visibleTransmissions.map((transmission) => {
               const channel = sampleChannels.find(c => c.id === transmission.channel);
               if (!channel) return null;

               const x = timeScale(transmission.startTime);
               const y = channelScale(transmission.channel);
               if (y === undefined) return null;
               
               const width = timeScale(transmission.endTime) - x;
               const height = channelScale.bandwidth() * 0.8;
               const yOffset = (channelScale.bandwidth() - height) / 2;

               return (
                 <rect
                   key={transmission.id}
                   x={x}
                   y={y + yOffset}
                   width={Math.max(width, 2)}
                   height={height}
                   fill={channel.color}
                   opacity={0.8}
                   rx={2}
                   className="hover:opacity-100 transition-opacity cursor-pointer"
                 />
               );
             })}

                         {/* Time axis */}
             <AxisTop
               scale={timeScale}
               top={0}
               left={0}
               tickComponent={(tickProps) => {
                  // We need to get the raw date from the scale domain
                  // The x position corresponds to a specific time in our scale
                  const { formattedValue, ...tickPropsWithoutFormattedValue } = tickProps
                  const date = timeScale.invert(tickProps.x)
                  const dateStr = format(date, 'L/d/yy (E)');
                  const timeStr = format(date, 'HH:mm:ss');
                  return (
                    <g {...tickPropsWithoutFormattedValue}>
                      <text
                        fontSize={10}
                        textAnchor="middle"
                        fill="#6b7280"
                        transform="translate(0, -15)"
                        x={tickProps.x}
                        y={tickProps.y - 6}
                      >
                        {dateStr}
                      </text>
                      <text
                        fontSize={10}
                        textAnchor="middle"
                        fill="#6b7280"
                        transform="translate(0, -5)"
                        x={tickProps.x}
                        y={tickProps.y - 3}
                      >
                        {timeStr}
                      </text>
                    </g>
                  );
                }}
             />

                         {/* Channel axis */}
             {/*<AxisLeft
               scale={channelScale}
               left={0}
               tickFormat={(d) => {
                 const channel = sampleChannels.find(c => c.id === d);
                 return channel?.name || d;
               }}
               tickLabelProps={(d) => {
                 const channel = sampleChannels.find(c => c.id === d);
                 return {
                   fontSize: 11,
                   textAnchor: 'end',
                   fill: channel?.color || '#374151',
                   dy: '0.32em',
                 };
               }}
             />*/}
             <AxisLeft
               scale={channelScale}
               left={0}
               hideTicks={true}
               tickComponent={(tickProps) => {
                const { formattedValue, ...tickPropsWithoutFormattedValue } = tickProps
                const channel = sampleChannels.find(c => c.id === formattedValue)

                // We need to get the raw date from the scale domain
                // The x position corresponds to a specific time in our scale
                return (
                  <g {...tickPropsWithoutFormattedValue}>
                    <rect
                      x={-110}
                      y={tickProps.y - 10}
                      width={110}
                      height={20}
                      className={channel.index % 2 === 0 ? 'fill-white dark:fill-gray-850' : 'fill-gray-300 dark:fill-slate-750'}
                    />
                    <rect
                      x={-120}
                      y={tickProps.y - 10}
                      width={10}
                      height={22}
                      fill={channel?.color || '#374151'}
                    />
                    <text
                      fontSize={14}
                      textAnchor="start"
                      fill={channel?.color || '#374151'}
                      transform="translate(0, 2)"
                      x={-105}
                      y={tickProps.y + 3}
                      style={{ fontWeight: 900, borderColor: channel?.color || '#374151'}}
                    >
                      {channel?.name || formattedValue}
                    </text>
                  </g>
                );
              }}
            />
          </Group>
        </svg>
      </div>

      {/* Statistics */}
      <div className="flex w-half gap-4 text-sm text-center float-right mr-[40px] bg-gray-50 dark:bg-gray-700 rounded-sm">
        <SummaryCard
          title="Total Transmissions"
          text={visibleTransmissions.length} />
        <SummaryCard
          title="Active Channels"
          text={new Set(visibleTransmissions.map(t => t.channel)).size} />
        <SummaryCard
          title="Time Span"
          text={`${Math.round((visibleRange.end.getTime() - visibleRange.start.getTime()) / (1000 * 60))} min`} />
      </div>
    </div>
  );
}