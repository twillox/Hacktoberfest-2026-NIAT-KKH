import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from '../features/home/HomePage';
import { FindBloodPage } from '../features/emergency/FindBloodPage';
import { EmergencyDetailsPage } from '../features/emergency/EmergencyDetailsPage';
import { BloodBanksPage } from '../features/blood-banks/BloodBanksPage';
import { DonorRegisterPage } from '../features/donors/DonorRegisterPage';
import { DonorDashboardPage } from '../features/donors/DonorDashboardPage';
import { DonorScreeningPage } from '../features/donors/DonorScreeningPage';
import { AssistantPage } from '../features/assistant/AssistantPage';
import { CoordinatorPage } from '../features/coordinator/CoordinatorPage';
import { ActivityPage } from '../features/activity/ActivityPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { PrivacyPage } from '../features/legal/PrivacyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'find-blood',
        element: <FindBloodPage />,
      },
      {
        path: 'blood-banks',
        element: <BloodBanksPage />,
      },
      {
        path: 'emergency/:id',
        element: <EmergencyDetailsPage />,
      },
      {
        path: 'donor/register',
        element: <DonorRegisterPage />,
      },
      {
        path: 'donor/dashboard',
        element: <DonorDashboardPage />,
      },
      {
        path: 'donor/invitation/:id',
        element: <DonorDashboardPage />,
      },
      {
        path: 'donor/invitation/:id/screening',
        element: <DonorScreeningPage />,
      },
      {
        path: 'assistant',
        element: <AssistantPage />,
      },
      {
        path: 'coordinator',
        element: <CoordinatorPage />,
      },
      {
        path: 'activity',
        element: <ActivityPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
