import assessment from '../data/assessment.json';
import schedule from '../data/schedule.json';
import governance from '../data/governance.json';

export type ProjectControlsPayload = {
  assessment: typeof assessment;
  schedule: typeof schedule;
  governance: typeof governance;
  system: {
    application: string;
    architecture: string;
    scheduleAuthority: string;
    commercialAuthority: string;
    presentationLayer: string;
    generatedAt: string;
  };
};

/**
 * Shared server-side source for the Vercel frontend and API routes.
 * Keeping the data assembly here prevents the website and backend from
 * drifting into separate versions of the project-controls model.
 */
export function getProjectControlsData(): ProjectControlsPayload {
  return {
    assessment,
    schedule,
    governance,
    system: {
      application: 'Chinaimo Project Controls',
      architecture: 'Next.js full-stack application on Vercel',
      scheduleAuthority: 'Microsoft Project',
      commercialAuthority: 'Excel',
      presentationLayer: 'Web / PDF',
      generatedAt: new Date().toISOString(),
    },
  };
}
