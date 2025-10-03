import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { load } from "js-yaml";
import { Button } from "@/components/ui/button";
import { RiddleCard } from "@/components/ui/RiddleCard";
import { Config } from "@/types/config";
import { useRiddleState } from "@/hooks/useRiddleState";
import { ChevronRight, ChevronLeft } from "lucide-react";

const RiddlePage = () => {
  const { riddleId } = useParams<{ riddleId: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<Config | null>(null);
  const { answers, setRiddleAnswer, initializeRiddle } = useRiddleState();

  useEffect(() => {
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

  const currentRiddleId = parseInt(riddleId || "1");
  const currentRiddle = config?.riddles.find((r) => r.id === currentRiddleId);

  useEffect(() => {
    if (currentRiddle) {
      initializeRiddle(currentRiddle.id, currentRiddle.type);
    }
  }, [currentRiddle?.id]);

  if (!config || !currentRiddle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-2xl animate-pulse">Cargando...</div>
      </div>
    );
  }

  const isLastRiddle = currentRiddleId === config.riddles.length;
  const isFirstRiddle = currentRiddleId === 1;

  const handleNext = () => {
    if (isLastRiddle) {
      navigate("/result");
    } else {
      navigate(`/riddle/${currentRiddleId + 1}`);
    }
  };

  const handlePrevious = () => {
    if (isFirstRiddle) {
      navigate("/");
    } else {
      navigate(`/riddle/${currentRiddleId - 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-serif text-primary">
              Acertijo {currentRiddleId} de {config.riddles.length}
            </h1>
            <div className="flex gap-2">
              {config.riddles.map((r) => (
                <div
                  key={r.id}
                  className={`h-2 w-12 rounded-full transition-all ${
                    r.id === currentRiddleId
                      ? "bg-primary"
                      : r.id < currentRiddleId
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <RiddleCard
          riddle={currentRiddle}
          values={answers[currentRiddleId] || (currentRiddle.type === "dual_input" ? ["", ""] : [""])}
          onChange={setRiddleAnswer}
        />

        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            {isFirstRiddle ? "Inicio" : "Anterior"}
          </Button>
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLastRiddle ? "Ver Resultado" : "Siguiente"}
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RiddlePage;
