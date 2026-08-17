// PartnersSection → re-exports the premium ClientsSection component
// This allows all existing pages to keep their import paths while using the new design
import { ClientsSection, ClientsSectionProps } from "./ClientsSection";

export const PartnersSection = (props: ClientsSectionProps) => {
  return <ClientsSection {...props} />;
};
