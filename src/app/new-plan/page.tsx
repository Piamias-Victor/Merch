import SiteContainer from "@/components/layout/SiteContainer";
import PlanSizeSelector from "@/components/plan/PlanSizeSelector";

export default function NewPlanPage() {
  return (
    <SiteContainer>
      <div className="container mx-auto px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Créer un nouveau plan</h1>
          <PlanSizeSelector />
        </div>
      </div>
    </SiteContainer>
  );
}