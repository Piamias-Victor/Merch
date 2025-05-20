"use client";

import SiteContainer from "@/components/layout/SiteContainer";
import PharmacyButton from "@/components/ui/pharmacy-button";
import { motion } from "framer-motion";
import { LayoutGrid, Calendar, Activity, Users, Award, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <SiteContainer>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[#f0f7ff] -z-10" />
        
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-12 gap-12 items-center">
            {/* Content Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="col-span-6 space-y-6 pr-10"
            >
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-[#0A5B91]/10 text-[#0A5B91]">
                Solution professionnelle pour pharmacies
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight text-gray-900">
                Optimisez l&apos;agencement de votre <span className="text-[#0A5B91]">pharmacie</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Concevez, organisez et optimisez l&apos;aménagement de votre pharmacie avec notre outil intuitif d&apos;agencement visuel.
              </p>
              
              <div className="flex gap-4 pt-2">
                <Link href="/new-plan">
                  <PharmacyButton 
                    size="lg"
                    iconRight={<LayoutGrid size={20} />}
                  >
                    Commencer un nouveau plan
                  </PharmacyButton>
                </Link>
                <PharmacyButton 
                  size="lg" 
                  variant="outline"
                  iconRight={<Calendar size={20} />}
                >
                  Demander une démo
                </PharmacyButton>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#0A5B91]/10 flex items-center justify-center">
                    <Award size={20} className="text-[#0A5B91]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Interface intuitive</p>
                    <p className="text-sm text-gray-600">Simple à utiliser</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#0A5B91]/10 flex items-center justify-center">
                    <Activity size={20} className="text-[#0A5B91]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Optimisé</p>
                    <p className="text-sm text-gray-600">Pour votre activité</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Image Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="col-span-6 rounded-2xl overflow-hidden shadow-xl shadow-[#0A5B91]/10"
            >
              <div className="aspect-[4/3] relative bg-[#F5F7FA] w-full">
                {/* Placeholder for actual pharmacy layout image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-white">
                  <div className="text-center">
                    <LayoutGrid size={64} className="text-[#0A5B91]/30 mx-auto mb-4" />
                    <p className="text-lg text-gray-500">
                      Visualisez votre pharmacie avant de l&apos;aménager
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900"
            >
              Des fonctionnalités <span className="text-[#0A5B91]">conçues pour les pharmaciens</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Tout ce dont vous avez besoin pour créer l&apos;espace pharmaceutique idéal
            </motion.p>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                title: "Conception par glisser-déposer",
                description: "Créez facilement des plans détaillés avec notre interface intuitive qui ne nécessite aucune compétence technique.",
                icon: <LayoutGrid className="text-[#0A5B91]" size={24} />
              },
              {
                title: "Éléments pharmaceutiques spécialisés",
                description: "Accédez à une bibliothèque complète d&apos;éléments spécifiques aux pharmacies : comptoirs, rayonnages, zones client et plus encore.",
                icon: <Star className="text-[#0A5B91]" size={24} />
              },
              {
                title: "Analyse de circulation",
                description: "Optimisez le flux des clients grâce à nos outils d&apos;analyse qui identifient les goulots d&apos;étranglement et les zones sous-exploitées.",
                icon: <Users className="text-[#0A5B91]" size={24} />
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg shadow-[#0A5B91]/5 border border-gray-100 hover:border-[#0A5B91]/20 hover:shadow-xl hover:shadow-[#0A5B91]/10 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-[#0A5B91]/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-12 gap-12 items-center">
            <div className="col-span-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-[#0A5B91]/10 border border-gray-100"
              >
                <div className="aspect-video relative bg-[#F5F7FA] w-full">
                  {/* Placeholder for actual video or screenshot */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-white">
                    <p className="text-lg text-gray-500 px-8 text-center">
                      Démonstration de l&apos;interface d&apos;agencement
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-6 space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Comment <span className="text-[#0A5B91]">ça marche</span>
              </h2>
              
              <p className="text-lg text-gray-600">
                Un processus simplifié en trois étapes pour créer le plan parfait de votre pharmacie.
              </p>
              
              <div className="space-y-6">
                {[
                  { 
                    step: 1,
                    title: "Créez votre plan",
                    description: "Utilisez notre éditeur intuitif pour concevoir votre espace pharmaceutique avec précision."
                  },
                  {
                    step: 2,
                    title: "Personnalisez chaque zone",
                    description: "Ajustez les dimensions, les couleurs et les propriétés de chaque élément selon vos besoins spécifiques."
                  },
                  {
                    step: 3,
                    title: "Optimisez et partagez",
                    description: "Analysez l&apos;efficacité de votre aménagement, puis exportez ou partagez votre plan final."
                  }
                ].map((step, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-[#0A5B91] text-white flex items-center justify-center font-medium">
                        {step.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Link href="/editor">
                  <PharmacyButton>
                    Essayer maintenant
                  </PharmacyButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-8">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0A5B91] to-[#4882b4] p-16 shadow-xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white" />
            </div>
            
            <div className="relative z-10 grid grid-cols-12 gap-12 items-center">
              <div className="col-span-8 space-y-4">
                <h2 className="text-3xl font-bold text-white">
                  Prêt à transformer votre espace pharmaceutique?
                </h2>
                <p className="text-white/90 text-lg">
                  Rejoignez les centaines de pharmaciens qui optimisent déjà leur espace et améliorent l&apos;expérience de leurs clients.
                </p>
              </div>
              
              <div className="col-span-4 flex flex-col items-end space-y-4">
                <Link href="/editor">
                  <PharmacyButton 
                    className="bg-white text-[#0A5B91] hover:bg-white/90" 
                    size="lg"
                  >
                    Commencer gratuitement
                  </PharmacyButton>
                </Link>
                <p className="text-white/80 text-sm">
                  Aucune carte de crédit requise
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteContainer>
  );
}