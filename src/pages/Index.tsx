import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { load } from "js-yaml";
import { Button } from "@/components/ui/button";
import { Config } from "@/types/config";
import { Sparkles, Heart } from "lucide-react";
import { useRiddleState } from "@/hooks/useRiddleState";

const Index = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<Config | null>(null);
  const { clearAnswers } = useRiddleState();

  useEffect(() => {
    // Clear any previous answers when starting fresh
    clearAnswers();
    
    fetch("/regalo-gzlez-soria/config.yaml")
      .then((response) => response.text())
      .then((text) => {
        const parsedConfig = load(text) as Config;
        setConfig(parsedConfig);
      })
      .catch((error) => {
        console.error("Error loading config:", error);
      });
  }, []);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-2xl animate-pulse">Cargando...</div>
      </div>
    );
  }

  const handleStart = () => {
    navigate("/riddle/1");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="flex justify-center gap-2 mb-6">
          <Heart className="text-primary animate-pulse fill-primary" size={24} />
          <Sparkles className="text-primary animate-pulse delay-100" size={20} />
          <Heart className="text-primary animate-pulse delay-200 fill-primary" size={24} />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif text-primary mb-6">
          {config.page_title}
        </h1>
        
        <p className="text-2xl text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
          {config.welcome_message}
        </p>

        <div className="pt-8">
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-8 text-xl shadow-glow transition-all duration-300 hover:scale-105"
          >
            Comenzar los Acertijos
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          {config.riddles.length} acertijos te esperan
        </p>
      </div>
    </div>
  );
};

export default Index;
