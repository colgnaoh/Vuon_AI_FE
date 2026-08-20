import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';

import { RootLayout } from '@/layouts/RootLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/pages/auth/ProtectedRoute';

import { LandingPage } from '@/pages/LandingPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { IdeasPage } from '@/pages/ideas/IdeasPage';
import { IdeaDetailPage } from '@/pages/ideas/IdeaDetailPage';
import { ProjectsPage } from '@/pages/projects/ProjectsPage';
import { ProjectDetailPage } from '@/pages/projects/ProjectDetailPage';
import { ProjectManagePage } from '@/pages/projects/ProjectManagePage';
import { EquipmentPage } from '@/pages/equipment/EquipmentPage';
import { MyBookingsPage } from '@/pages/equipment/MyBookingsPage';

import { EventsPage } from '@/pages/events/EventsPage';
import { EventDetailPage } from '@/pages/events/EventDetailPage';
import { MentorsPage } from '@/pages/mentors/MentorsPage';
import { MentorDetailPage } from '@/pages/mentors/MentorDetailPage';
import { LabsPage } from '@/pages/labs/LabsPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';

import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminEquipmentPage } from '@/pages/admin/AdminEquipmentPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminBookingsPage } from '@/pages/admin/AdminBookingsPage';
import { AdminIdeasPage } from '@/pages/admin/AdminIdeasPage';
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            
            {/* Public & Member Routes wrapped in RootLayout */}
            <Route element={<RootLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/directory" element={<Navigate to="/ideas" replace />} />
              <Route path="/ideas" element={<IdeasPage />} />
              <Route path="/ideas/:id" element={<IdeaDetailPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/mentors" element={<MentorsPage />} />
              <Route path="/mentors/:id" element={<MentorDetailPage />} />
              <Route path="/labs" element={<LabsPage />} />

              {/* Protected Member Routes */}
              <Route
                path="/profile/me"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id/manage"
                element={
                  <ProtectedRoute>
                    <ProjectManagePage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin Console Routes wrapped in AdminLayout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'LabManager']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="equipment" element={<AdminEquipmentPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="ideas" element={<AdminIdeasPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};


export default App;
