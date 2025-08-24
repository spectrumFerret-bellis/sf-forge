import React, { useState, useMemo, useRef, useEffect } from "react";
import { Group } from "@visx/group";
import { scaleTime, scaleBand } from "@visx/scale";
import { AxisLeft, AxisTop } from "@visx/axis";
import { format, addMinutes } from "date-fns";
import { useTransmissionTimelineSummary } from "@/hooks/api/transmissionSummary";
import { usePlaylistChannels } from "@/hooks/api/playlistChannels";
import { usePlaylistStore } from "@/stores/playlistStore";

// Types for transmission data
interface Transmission {
  id: string;
  channel: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  type: "voice" | "data" | "emergency";
  signalStrength: number; // 1-5
}

interface Channel {
  id: string;
  name: string;
  color: string;
  frequency?: string;
  index: number;
}

const SummaryCard = ({
  title,
  text,
}: {
  title: string;
  text: string | number;
}) => (
  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
    <div className="font-medium text-gray-700 dark:text-gray-300">
      <span className="font-bold">{title}:</span> {text}
    </div>
  </div>
);

export function TransmissionTimeline() {
  const { selectedPlaylist, timeRange, getChannelColor, setChannelColors } =
    usePlaylistStore();
  const [zoomLevel, setZoomLevel] = useState(23);
  const [visibleRange, setVisibleRange] = useState<{ start: Date; end: Date }>({
    start: new Date("2025-08-21T12:08:23"),
    end: new Date("2025-08-21T16:30:26"),
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Get playlist channels
  const { data: playlistChannelsData } = usePlaylistChannels(
    selectedPlaylist?.id || "",
    timeRange || undefined
  );

  // Get channel IDs for the summary query
  const channelIds = useMemo(() => {
    if (!playlistChannelsData?.channels) return [];
    return playlistChannelsData.channels.map((ch) => ch.channel_id);
  }, [playlistChannelsData]);

  // Set channel colors in store when channels change
  useEffect(() => {
    if (channelIds.length > 0) {
      setChannelColors(channelIds);
    }
  }, [channelIds, setChannelColors]);

  // Get transmission summary data
  const {
    data: summaryData,
    isLoading,
    error,
  } = useTransmissionTimelineSummary(
    channelIds,
    timeRange || undefined,
    !!selectedPlaylist && !!timeRange
  );

  // Transform API data to component format
  const channels = useMemo(() => {
    if (!playlistChannelsData?.channels) return [];

    return playlistChannelsData.channels.map((ch, index) => {
      // Get channel color from store using the same strategy as textLog
      const channelColor = getChannelColor(ch.channel_id);

      return {
        id: ch.channel_id, // This is playlist_channelable_id
        name: ch.channel_name || `Channel ${index + 1}`,
        color: channelColor,
        index,
      };
    });
  }, [playlistChannelsData, getChannelColor]);

  const transmissions = useMemo(() => {
    if (!summaryData?.channelSummaries) return [];

    const allTransmissions: Transmission[] = [];

    summaryData.channelSummaries.forEach((channelSummary) => {
      // Find the corresponding playlist channel by matching the channel ID
      // We need to match the transmission channel ID with the playlist channel ID
      const playlistChannel = channels.find((c) => {
        // Try to match by the channel name from transmission data
        return c.name === channelSummary.channelName;
      });

      if (!playlistChannel) return; // Skip if no matching channel found

      // Convert summary transmissions to component format
      channelSummary.transmissions.forEach((tx) => {
        allTransmissions.push({
          id: tx.id,
          channel: playlistChannel.id, // Use playlist channel ID
          startTime: new Date(tx.startTime),
          endTime: new Date(tx.endTime),
          duration: tx.duration / (1000 * 60), // Convert ms to minutes
          type: "voice", // Default type
          signalStrength: 3, // Default signal strength
        });
      });
    });

    return allTransmissions.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );
  }, [summaryData, channels]);

  // Update visible range when timeRange changes
  useEffect(() => {
    if (timeRange) {
      setVisibleRange({
        start: timeRange.start,
        end: timeRange.end,
      });
    }
  }, [timeRange]);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Chart dimensions
  const [containerWidth, setContainerWidth] = useState(1200);
  const height = 360;
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
    domain: channels.map((ch) => ch.id),
    range: [0, chartHeight],
    padding: 0.1,
  });

  // Filter transmissions for visible range
  const visibleTransmissions = transmissions.filter(
    (t) => t.startTime >= visibleRange.start && t.endTime <= visibleRange.end
  );

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 100));
    const range = visibleRange.end.getTime() - visibleRange.start.getTime();
    const newRange = range * 0.9;
    const center = new Date(visibleRange.start.getTime() + range / 2);
    setVisibleRange({
      start: new Date(center.getTime() - newRange / 2),
      end: new Date(center.getTime() + newRange / 2),
    });
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 10));
    const range = visibleRange.end.getTime() - visibleRange.start.getTime();
    const newRange = range * 1.1;
    const center = new Date(visibleRange.start.getTime() + range / 2);
    setVisibleRange({
      start: new Date(center.getTime() - newRange / 2),
      end: new Date(center.getTime() + newRange / 2),
    });
  };

  const handleReset = () => {
    if (timeRange) {
      setZoomLevel(23);
      setVisibleRange({
        start: timeRange.start,
        end: timeRange.end,
      });
    }
  };

  const handleShowAll = () => {
    if (transmissions.length > 0) {
      setZoomLevel(100);
      const lastTransmission = transmissions[transmissions.length - 1];
      setVisibleRange({
        start: transmissions[0].startTime,
        end: lastTransmission.endTime,
      });
    }
  };

  const formatTimeRange = () => {
    const startStr = format(visibleRange.start, "M/d/yyyy, h:mm:ss a");
    const endStr = format(visibleRange.end, "M/d/yyyy, h:mm:ss a");
    const durationMinutes = Math.round(
      (visibleRange.end.getTime() - visibleRange.start.getTime()) / (1000 * 60)
    );
    return `${startStr} - ${endStr} (${durationMinutes} min)`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-transparent">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">
            Loading transmission data...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full bg-white dark:bg-transparent">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading transmission data: {error.message}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!channels.length || !transmissions.length) {
    return (
      <div className="w-full bg-white dark:bg-transparent">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">
            No transmission data available
          </div>
        </div>
      </div>
    );
  }

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
 {/*           {Array.from({ length: 25 }, (_, i) => {
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
            })}*/}

            {/* Channel lanes */}
            {channels.map((channel, i) => {
              const y = channelScale(channel.id);
              const laneHeight = channelScale.bandwidth();
              return (
                <rect
                  key={channel.id}
                  x={0}
                  y={y}
                  width={chartWidth}
                  height={laneHeight}
                  fill={channel.color}
                  opacity={0.2}
                />
              );
            })}

            {/* Transmission bars */}
            {visibleTransmissions.map((transmission) => {
              const channel = channels.find(
                (c) => c.id === transmission.channel
              );
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
                const { formattedValue, ...tickPropsWithoutFormattedValue } =
                  tickProps;
                const date = timeScale.invert(tickProps.x);
                const dateStr = format(date, "L/d/yy (E)");
                const timeStr = format(date, "HH:mm:ss");
                const textSize = 13

                return (<>
                  {/* Background vertical lines across timeline */}
                  <line
                    x1={tickProps.x}
                    y1={tickProps.y + textSize - 2}
                    x2={tickProps.x}
                    y2={tickProps.y + chartHeight + (textSize / 2)}
                    className="stroke-slate-600 opacity-30"
                    strokeWidth={1}
                    strokeDasharray="2,2"
                  />

                  {/* The transmission block indicating a transmission length */}
                  <g {...tickPropsWithoutFormattedValue}>
                    <text
                      fontSize={textSize}
                      textAnchor="middle"
                      fill="#6b7280"
                      transform="translate(0, -15)"
                      x={tickProps.x}
                      y={tickProps.y - 6}
                    >
                      {dateStr}
                    </text>
                    <text
                      fontSize={textSize}
                      textAnchor="middle"
                      fill="#6b7280"
                      transform="translate(0, -5)"
                      x={tickProps.x}
                      y={tickProps.y - 3}
                    >
                      {timeStr}
                    </text>
                  </g>
                </>);
              }}
            />

            {/* Channel axis */}
            <AxisLeft
              scale={channelScale}
              left={0}
              hideTicks={true}
              tickComponent={(tickProps) => {
                const { formattedValue, ...tickPropsWithoutFormattedValue } =
                  tickProps;
                const channel = channels.find((c) => c.id === formattedValue);
                const laneHeight = channelScale.bandwidth();
                const textSize = 14;

                // We need to get the raw date from the scale domain
                // The x position corresponds to a specific time in our scale
                return (
                  <g {...tickPropsWithoutFormattedValue}>
                    {/* Full sidebar */}
                    <rect
                      x={-110}
                      y={tickProps.y - 10}
                      width={110}
                      height={laneHeight}
                      fill={"#374151"}
                      opacity={0.2}
                    />

                    {/* Outside left color lane border */}
                    <rect
                      x={-120}
                      y={tickProps.y - 10}
                      width={10}
                      height={laneHeight}
                      fill={channel?.color || "#374151"}
                    />

                    {/* Lane label */}
                    <text
                      fontSize={textSize}
                      textAnchor="start"
                      className="fill-slate-600 dark:fill-slate-300"
                      // transform="translate(0, 2)"
                      x={-105}
                      y={tickProps.y + textSize / 2}
                      style={{ borderColor: channel?.color || "#374151" }}
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
          text={summaryData?.totalTransmissions || 0}
        />
        <SummaryCard
          title="Active Channels"
          text={summaryData?.activeChannels || 0}
        />
        <SummaryCard
          title="Time Span"
          text={`${summaryData?.timeSpan || 0} min`}
        />
      </div>
    </div>
  );
}
