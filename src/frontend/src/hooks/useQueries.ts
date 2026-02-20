import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, UserRegistration, ChatMessageContent, PollOption, UserRole } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useQueries] Fetching caller user profile');
      const profile = await actor.getCallerUserProfile();
      console.log('[useQueries] Profile fetched:', profile ? 'exists' : 'null');
      return profile;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      console.log('[useSaveCallerUserProfile] Starting mutation');
      console.log('[useSaveCallerUserProfile] Actor available:', !!actor);
      
      if (!actor) {
        const error = new Error('Actor not available');
        console.error('[useSaveCallerUserProfile] Error:', error);
        throw error;
      }
      
      console.log('[useSaveCallerUserProfile] Calling backend with profile:', {
        ...profile,
        aadharPhoto: '[ExternalBlob]',
      });
      
      try {
        const result = await actor.saveCallerUserProfile(profile);
        console.log('[useSaveCallerUserProfile] Backend call successful');
        return result;
      } catch (error: any) {
        console.error('[useSaveCallerUserProfile] Backend call failed:', error);
        console.error('[useSaveCallerUserProfile] Error details:', {
          message: error?.message,
          stack: error?.stack,
          cause: error?.cause,
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('[useSaveCallerUserProfile] Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error: any) => {
      console.error('[useSaveCallerUserProfile] Mutation error:', error);
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserRegistration) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useRegisterUser] Registering user');
      return actor.registerUser(data);
    },
    onSuccess: () => {
      console.log('[useRegisterUser] Registration successful');
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error: any) => {
      console.error('[useRegisterUser] Registration failed:', error);
    },
  });
}

export function usePostAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postAnnouncement(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useGetAnnouncements() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnnouncements();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useGetChat() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessageContent[]>({
    queryKey: ['chat'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChat();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: ChatMessageContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
  });
}

export function useCreatePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question, options }: { question: string; options: PollOption[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPoll(question, options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
  });
}

export function useVoteInPoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pollId, optionId }: { pollId: bigint; optionId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.voteInPoll(pollId, optionId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pollResults', variables.pollId.toString()] });
    },
  });
}

export function useGetPollResults(pollId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['pollResults', pollId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPollResults(pollId);
    },
    enabled: !!actor && !isFetching,
  });
}
