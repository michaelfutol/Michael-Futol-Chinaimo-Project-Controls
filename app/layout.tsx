import './globals.css';
import './refinements.css';
import './assessment-theme.css';
import type { Metadata } from 'next';
import Telemetry from './Telemetry';
import Enhancements from './Enhancements';
import SCurvePrecision from './SCurvePrecision';
import SCurveStory from './SCurveStory';
import GanttViewerControls from './GanttViewerControls';
import OfficeReviewLinks from './OfficeReviewLinks';
import OwnerAwareAnalytics from './OwnerAwareAnalytics';
import EngineerNotesShelf from './EngineerNotesShelf';
import AssessmentThemeToggle from './AssessmentThemeToggle';

export const metadata: Metadata = {
  title: 'Michael Futol - Chinaimo Project Controls Assessment',
  description: 'Project controls technical assessment for the Chinaimo Water Treatment Plant project.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AssessmentThemeToggle />
        <Enhancements />
        <GanttViewerControls />
        <OfficeReviewLinks />
        <SCurvePrecision />
        <SCurveStory />
        <EngineerNotesShelf />
        <Telemetry />
        <OwnerAwareAnalytics />
      </body>
    </html>
  );
}
