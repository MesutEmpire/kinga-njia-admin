import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '../api/services/statistics';

export const useStatistics = (days?: number) => {
    return useQuery({
        queryKey: ['statistics', days],
        queryFn: () => statisticsService.getStatistics(days),
        staleTime: 5 * 60 * 1000, // 5 minutes - statistics change slowly
        refetchInterval: false, // Disable automatic refetching
        refetchOnWindowFocus: true, // Refetch when user returns to tab
    });
};

export const useTodayActivity = () => {
    return useQuery({
        queryKey: ['todayActivity'],
        queryFn: () => statisticsService.getTodayActivity(),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: false, // Disable automatic refetching
        refetchOnWindowFocus: true,
    });
};

