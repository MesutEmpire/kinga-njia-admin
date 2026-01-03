import { apiClient } from '../client';

export interface TodayActivity {
    newClaims: number;
    processed: number;
    verified: number;
    rejected: number;
}

export interface LocationStats {
    location: string;
    claimCount: number;
}

export interface TimeSeriesData {
    period: string;
    count: number;
}

export interface Statistics {
    totalClaims: number;
    verifiedClaims: number;
    pendingClaims: number;
    rejectedClaims: number;
    resolvedClaims: number;
    verificationRate: number;
    verifiedPercentage: number;
    pendingPercentage: number;
    rejectedPercentage: number;
    resolvedPercentage: number;
    totalClaimsChange: number;
    verificationRateChange: number;
    activeUsersChange: number;
    todayActivity: TodayActivity;
    weeklyActivity?: {
        newClaims: number;
        processed: number;
        verified: number;
        rejected: number;
        backlog: number;
    };
    processingMetrics?: {
        averageProcessingTimeHours: number;
        fastestTimeMinutes: number;
        slowestTimeHours: number;
        targetTimeHours: number;
        targetMet: boolean;
    };
    claimsBySeverity: Record<string, number>;
    topLocations: LocationStats[];
    claimsByTimePeriod: TimeSeriesData[];
}

export const statisticsService = {
    getStatistics: async (days?: number): Promise<Statistics> => {
        const params = days ? { days } : {};
        const response = await apiClient.get<Statistics>('/statistics', { params });
        return response.data;
    },

    getTodayActivity: async (): Promise<TodayActivity> => {
        const response = await apiClient.get<TodayActivity>('/statistics/today');
        return response.data;
    },
};
