import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DriftEvent, DriftEventDetail, DriftFinding, CodeChange } from '@/types/drift'
import { isEventInProgress } from '@/types/drift'

/**
 * Hook to fetch all drift events for a repository
 */
export function useDriftEvents(repoId: string) {
  return useQuery({
    queryKey: ['driftEvents', repoId],
    queryFn: async () => {
      const response = await api.get<DriftEvent[]>(`/repos/${repoId}/drift-events`)
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    staleTime: 10 * 1000, // 10 seconds
    enabled: !!repoId,
  })
}

/**
 * Hook to fetch a single drift event with full details
 */
export function useDriftEventDetail(repoId: string, eventId: string) {
  return useQuery({
    queryKey: ['driftEventDetail', repoId, eventId],
    queryFn: async () => {
      const response = await api.get<DriftEventDetail>(`/repos/${repoId}/drift-events/${eventId}`)
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    staleTime: 5 * 1000, // 5 seconds for active events
    refetchInterval: (query) => {
      // Poll more frequently if event is in progress
      const data = query.state.data
      if (data && isEventInProgress(data.processing_phase)) {
        return 5000 // 5 seconds
      }
      return false // Don't poll for completed events
    },
    enabled: !!repoId && !!eventId,
  })
}

/**
 * Hook to fetch drift findings for an event
 */
export function useDriftFindings(repoId: string, eventId: string) {
  return useQuery({
    queryKey: ['driftFindings', repoId, eventId],
    queryFn: async () => {
      const response = await api.get<DriftFinding[]>(
        `/repos/${repoId}/drift-events/${eventId}/findings`
      )
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!repoId && !!eventId,
  })
}

/**
 * Hook to fetch code changes for an event
 */
export function useCodeChanges(repoId: string, eventId: string) {
  return useQuery({
    queryKey: ['codeChanges', repoId, eventId],
    queryFn: async () => {
      const response = await api.get<CodeChange[]>(
        `/repos/${repoId}/drift-events/${eventId}/code-changes`
      )
      if (response.error) throw new Error(response.error)
      return response.data!
    },
    staleTime: 60 * 1000, // 1 minute (code changes don't update)
    enabled: !!repoId && !!eventId,
  })
}
