"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import PharmacyButton from "@/components/ui/pharmacy-button";
import { ChevronRight, Layout } from "lucide-react";

interface PlanSize {
  name: string;
  width: number;
  height: number;
  description: string;
}

const PRESET_SIZES: PlanSize[] = [
  { name: "Petite pharmacie", width: 800, height: 600, description: "60-80m²" },
  { name: "Moyenne pharmacie", width: 1200, height: 900, description: "100-150m²" },
  { name: "Grande pharmacie", width: 1600, height: 1200, description: "200-300m²" },
  { name: "Très grande pharmacie", width: 2000, height: 1500, description: "300m² et plus" },
];

export default function PlanSizeSelector() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [selectedSize, setSelectedSize] = useState<PlanSize | null>(null);
  const [customWidth, setCustomWidth] = useState<number>(1200);
  const [customHeight, setCustomHeight] = useState<number>(900);
  const [unit, setUnit] = useState<"px" | "cm" | "m">("px");
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [name, setName] = useState<string>("");

  // Facteur de conversion pour les unités
  const unitFactors = {
    px: 1,
    cm: 10, // 10px = 1cm (exemple)
    m: 1000 // 1000px = 1m (exemple)
  };

  // Conversion entre unités et pixels
  const toPixels = (value: number): number => {
    return Math.round(value * unitFactors[unit]);
  };

  const fromPixels = (pixels: number): number => {
    return Number((pixels / unitFactors[unit]).toFixed(2));
  };

  // Handler pour la largeur personnalisée
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseFloat(e.target.value);
    if (isNaN(newWidth) || newWidth <= 0) return;
    
    const newWidthPx = toPixels(newWidth);
    
    setCustomWidth(newWidthPx);
    
    if (maintainRatio && selectedSize) {
      const ratio = selectedSize.height / selectedSize.width;
      setCustomHeight(Math.round(newWidthPx * ratio));
    }
  };

  // Handler pour la hauteur personnalisée
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseFloat(e.target.value);
    if (isNaN(newHeight) || newHeight <= 0) return;
    
    const newHeightPx = toPixels(newHeight);
    
    setCustomHeight(newHeightPx);
    
    if (maintainRatio && selectedSize) {
      const ratio = selectedSize.width / selectedSize.height;
      setCustomWidth(Math.round(newHeightPx * ratio));
    }
  };

  // Handler pour la sélection d'une taille prédéfinie
  const handleSizeSelect = (size: PlanSize) => {
    setSelectedSize(size);
    setCustomWidth(size.width);
    setCustomHeight(size.height);
  };

  // Handler pour la création du plan
  const handleCreatePlan = () => {
    // Préparer les paramètres à passer à l'éditeur
    const params = new URLSearchParams();
    
    if (activeTab === "presets" && selectedSize) {
      params.append("width", selectedSize.width.toString());
      params.append("height", selectedSize.height.toString());
      params.append("name", name || selectedSize.name);
    } else {
      params.append("width", customWidth.toString());
      params.append("height", customHeight.toString());
      params.append("name", name || "Plan personnalisé");
    }
    
    // Rediriger vers l'éditeur avec les paramètres
    router.push(`/editor?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 max-w-3xl w-full">
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-2xl font-semibold text-gray-900">Créer un nouveau plan</h2>
        <p className="text-gray-600 mt-1">Définissez les dimensions et les propriétés de votre plan</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "presets" 
              ? "border-[#0A5B91] text-[#0A5B91]" 
              : "border-transparent text-gray-600 hover:text-gray-900"
          )}
          onClick={() => setActiveTab("presets")}
        >
          Formats prédéfinis
        </button>
        <button
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "custom" 
              ? "border-[#0A5B91] text-[#0A5B91]" 
              : "border-transparent text-gray-600 hover:text-gray-900"
          )}
          onClick={() => setActiveTab("custom")}
        >
          Dimensions personnalisées
        </button>
      </div>
      
      <div className="p-6">
        {/* Nom du plan */}
        <div className="mb-6">
          <label htmlFor="plan-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du plan
          </label>
          <input
            type="text"
            id="plan-name"
            placeholder="Mon plan de pharmacie"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
          />
        </div>
        
        {activeTab === "presets" ? (
          /* Formats prédéfinis */
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              Sélectionnez un format prédéfini pour votre pharmacie :
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {PRESET_SIZES.map((size) => (
                <button
                  key={size.name}
                  onClick={() => handleSizeSelect(size)}
                  className={cn(
                    "text-left p-4 rounded-lg border transition-all",
                    selectedSize?.name === size.name
                      ? "border-[#0A5B91] bg-[#0A5B91]/5 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-start">
                    <div className={cn(
                      "w-4 h-4 rounded-full mr-2 mt-1 flex-shrink-0 border-2",
                      selectedSize?.name === size.name
                        ? "border-[#0A5B91] bg-[#0A5B91]" 
                        : "border-gray-300"
                    )}/>
                    <div>
                      <h3 className="font-medium text-gray-900">{size.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {size.width} × {size.height} px
                        {size.description && ` (${size.description})`}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {selectedSize && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Aperçu des dimensions :</span>
                  <span className="text-sm text-gray-500">
                    {selectedSize.width} × {selectedSize.height} px
                  </span>
                </div>
                <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                  <div 
                    className="bg-[#0A5B91]/10 border border-[#0A5B91]/20 rounded relative"
                    style={{
                      width: `${Math.min(320, selectedSize.width / 3)}px`,
                      height: `${Math.min(240, selectedSize.height / 3)}px`,
                    }}
                  >
                    <Layout className="absolute-center text-[#0A5B91]/40" size={32} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Dimensions personnalisées */
          <div className="space-y-6">
            <div className="flex flex-col space-y-3">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="custom-width" className="block text-sm font-medium text-gray-700 mb-1">
                    Largeur
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="custom-width"
                      min="100"
                      value={fromPixels(customWidth)}
                      onChange={handleWidthChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as "px" | "cm" | "m")}
                      className="px-2 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
                    >
                      <option value="px">px</option>
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="custom-height" className="block text-sm font-medium text-gray-700 mb-1">
                    Hauteur
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="custom-height"
                      min="100"
                      value={fromPixels(customHeight)}
                      onChange={handleHeightChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as "px" | "cm" | "m")}
                      className="px-2 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
                    >
                      <option value="px">px</option>
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintain-ratio"
                  checked={maintainRatio}
                  onChange={(e) => setMaintainRatio(e.target.checked)}
                  className="h-4 w-4 text-[#0A5B91] focus:ring-[#0A5B91] border-gray-300 rounded"
                />
                <label htmlFor="maintain-ratio" className="ml-2 block text-sm text-gray-700">
                  Conserver les proportions
                </label>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Aperçu des dimensions :</span>
                <span className="text-sm text-gray-500">
                  {customWidth} × {customHeight} px
                </span>
              </div>
              <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                <div 
                  className="bg-[#0A5B91]/10 border border-[#0A5B91]/20 rounded relative flex items-center justify-center"
                  style={{
                    width: `${Math.min(320, customWidth / 3)}px`,
                    height: `${Math.min(240, customHeight / 3)}px`,
                  }}
                >
                  <Layout className="text-[#0A5B91]/40" size={32} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <PharmacyButton
            onClick={handleCreatePlan}
            disabled={activeTab === "presets" && !selectedSize}
            iconRight={<ChevronRight size={18} />}
          >
            Créer le plan
          </PharmacyButton>
        </div>
      </div>
    </div>
  );
}