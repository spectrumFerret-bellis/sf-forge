// Re-export all API hooks for easy importing
export * from './auth'
export * from './playlists'
export * from './transmissions'
export * from './transmissionSummary'
export * from './transcriptions'
export * from './sttEngines'
export * from './playlistChannels'

// Explicit exports to resolve naming conflicts
export type { 
  RadioTrunkingChannel as RadioTrunkingChannelFromChannels
} from './channels'
export { 
  useTrunkingChannel as useTrunkingChannelFromChannels 
} from './channels'

export type { 
  RadioTrunkingChannel as RadioTrunkingChannelFromTrunking
} from './trunkingChannels'
export { 
  useTrunkingChannel as useTrunkingChannelFromTrunking 
} from './trunkingChannels'

// Export other non-conflicting items from channels and trunkingChannels
export type { 
  RadioConventionalChannel,
  ChannelDetails
} from './channels'
export { 
  channelKeys,
  useConventionalChannel,
  useChannelDetails,
  useChannelTransmissionCount
} from './channels'

export { 
  trunkingChannelKeys,
  useTrunkingChannels,
  useTrunkingReceiveChannels,
  useChannelAttributes,
  useCreateTrunkingChannel,
  useUpdateTrunkingChannel,
  useDeleteTrunkingChannel
} from './trunkingChannels'
