import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { load } from "js-yaml";
import { Button } from "@/components/ui/button";
import { Config } from "@/types/config";
import { useRiddleState } from "@/hooks/useRiddleState";
import { Sparkles, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResultPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<Config | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const { answers, clearAnswers } = useRiddleState();
  const { toast } = useToast();

  useEffect(() => {
    fetch("/config.yaml")
      .then((response) => response.text())
      .then((text) => {
        const parsedConfig = load(text) as Config;
        setConfig(parsedConfig);
      })
      .catch((error) => {
        console.error("Error loading config:", error);
      });
  }, []);

  useEffect(() => {
    if (config) {
      verifyAnswers();
    }
  }, [config]);

  const verifyAnswers = () => {
    if (!config) return;

    const userAnswers: number[] = [];
    let allCorrect = true;

    config.riddles.forEach((riddle) => {
      const riddleAnswers = answers[riddle.id];
      
      if (!riddleAnswers) {
        allCorrect = false;
        return;
      }

      if (riddle.type === "dual_input") {
        const sum = riddleAnswers.reduce((acc, val) => acc + (parseInt(val) || 0), 0);
        userAnswers.push(sum);
        if (sum !== riddle.correct_answer) {
          allCorrect = false;
        }
      } else {
        const answer = parseInt(riddleAnswers[0]) || 0;
        userAnswers.push(answer);
        if (answer !== riddle.correct_answer) {
          allCorrect = false;
        }
      }
    });

    if (allCorrect) {
      const concatenated = userAnswers.join("");
      const encoded = btoa(concatenated);
      setVerificationCode(encoded);
      setIsVerified(true);
    } else {
      toast({
        title: "Intenta de nuevo",
        description: config.error_message,
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/riddle/1");
      }, 2000);
    }
  };

  const handleRestart = () => {
    clearAnswers();
    navigate("/");
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-2xl animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-2xl animate-pulse">Verificando respuestas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="flex justify-center gap-2 mb-6">
          <Sparkles className="text-primary animate-pulse" size={24} />
          <Sparkles className="text-primary animate-pulse delay-100" size={20} />
          <Sparkles className="text-primary animate-pulse delay-200" size={24} />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-serif text-primary mb-6">
          ¡Felicidades!
        </h1>
        
        <p className="text-2xl text-foreground mb-8">{config.success_message}</p>
        
        <div className="p-8 bg-card border-2 border-primary rounded-lg shadow-glow">
          <code className="text-3xl md:text-4xl font-mono text-primary break-all">
            {verificationCode}
          </code>
        </div>

        <Button
          onClick={handleRestart}
          variant="outline"
          className="mt-8 flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={20} />
          Empezar de nuevo
        </Button>
      </div>
    </div>
  );
};

export default ResultPage;
