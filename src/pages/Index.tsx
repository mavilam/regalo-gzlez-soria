import { useEffect, useState } from "react";
import { load } from "js-yaml";
import { Button } from "@/components/ui/button";
import { RiddleCard } from "@/components/ui/RiddleCard";
import { useToast } from "@/hooks/use-toast";
import { Config } from "@/types/config";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetch("/config.yaml")
      .then((response) => response.text())
      .then((text) => {
        const parsedConfig = load(text) as Config;
        setConfig(parsedConfig);
        
        // Initialize answers structure
        const initialAnswers: Record<number, string[]> = {};
        parsedConfig.riddles.forEach((riddle) => {
          initialAnswers[riddle.id] = riddle.type === "dual_input" ? ["", ""] : [""];
        });
        setAnswers(initialAnswers);
      })
      .catch((error) => {
        console.error("Error loading config:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración. Por favor, recarga la página.",
          variant: "destructive",
        });
      });
  }, []);

  const handleAnswerChange = (riddleId: number, index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [riddleId]: prev[riddleId].map((v, i) => (i === index ? value : v)),
    }));
  };

  const verifyAnswers = () => {
    if (!config) return;

    const userAnswers: number[] = [];
    let allCorrect = true;

    config.riddles.forEach((riddle) => {
      const riddleAnswers = answers[riddle.id];
      
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
      toast({
        title: "¡Éxito!",
        description: config.success_message,
      });
    } else {
      toast({
        title: "Intenta de nuevo",
        description: config.error_message,
        variant: "destructive",
      });
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-2xl animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (isVerified) {
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif text-primary mb-4 animate-fade-in">
            {config.page_title}
          </h1>
          <p className="text-xl text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
            {config.welcome_message}
          </p>
          <div className="flex justify-center gap-2 mt-6">
            <Sparkles className="text-primary animate-pulse" size={20} />
            <Sparkles className="text-primary animate-pulse delay-100" size={16} />
            <Sparkles className="text-primary animate-pulse delay-200" size={20} />
          </div>
        </header>

        <div className="space-y-8 mb-8">
          {config.riddles.map((riddle) => (
            <RiddleCard
              key={riddle.id}
              riddle={riddle}
              values={answers[riddle.id]}
              onChange={handleAnswerChange}
            />
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={verifyAnswers}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg shadow-glow transition-all duration-300 hover:scale-105"
          >
            {config.verify_button_text}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
