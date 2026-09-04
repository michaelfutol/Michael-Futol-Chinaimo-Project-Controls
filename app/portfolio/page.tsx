import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
  title: 'Michael Futol — Engineering Portfolio',
  description: 'Curated engineering portfolio of Michael Delovino Futol: project controls, technical office, structural/CAD, quantity surveying and construction engineering evidence.'
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
