import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

export interface WeatherData {
    temperature: number;
    wind_speed: number;
    wind_direction: string;
    conditions: string;
    suitable_for_parasailing: boolean;
}

export interface ChuteRecommendation {
    recommended_chute: string;
    wind_speed: number;
    rider_weight: number;
    safety_rating: string;
}

export const parasailApi = createApi({
    reducerPath: 'parasailApi',
    baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL }),
    endpoints: (builder) => ({
        getCurrentWeather: builder.query<WeatherData, void>({
            query: () => '/api/weather/current',
        }),
        getChuteRecommendation: builder.query<ChuteRecommendation, { wind_speed: number; rider_weight: number }>({
            query: ({ wind_speed, rider_weight }) =>
                `/api/chute/recommend?wind_speed=${wind_speed}&rider_weight=${rider_weight}`,
        }),
    }),
});

export const { useGetCurrentWeatherQuery, useGetChuteRecommendationQuery } = parasailApi;
