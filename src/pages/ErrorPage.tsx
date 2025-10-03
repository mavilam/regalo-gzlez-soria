import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRiddleState } from "@/hooks/useRiddleState";

interface ErrorPageProps {
  errorMessage: string;
}

const ErrorPage = ({ errorMessage }: ErrorPageProps) => {
  const navigate = useNavigate();
  const { clearAnswers } = useRiddleState();

  const handleStartAgain = () => {
    clearAnswers();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="flex justify-center mb-6">
          <AlertCircle className="text-primary" size={64} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
          ¡Ups!
        </h1>
        
        <p className="text-xl text-foreground mb-8">{errorMessage}</p>
    

        <Button
          onClick={handleStartAgain}
          className="mt-8 flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={20} />
          Empezar de nuevo
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
