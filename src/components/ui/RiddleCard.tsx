import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RiddleCardProps {
  riddle: {
    id: number;
    title: string;
    description: string;
    type: string;
    image_url?: string;
    input_labels?: string[];
  };
  values: string[];
  onChange: (riddleId: number, index: number, value: string) => void;
}

export const RiddleCard = ({ riddle, values, onChange }: RiddleCardProps) => {
  return (
    <Card className="p-6 bg-card border-border shadow-glow transition-all duration-500 hover:scale-[1.02]">
      <h2 className="text-2xl font-serif text-primary mb-4">{riddle.title}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">{riddle.description}</p>
      
      {riddle.image_url && (
        <div className="mb-6 rounded-lg overflow-hidden border-2 border-primary/30">
          <img 
            src={riddle.image_url} 
            alt={`Riddle ${riddle.id}`}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <div className="space-y-4">
        {riddle.type === "dual_input" && riddle.input_labels ? (
          <div className="grid grid-cols-2 gap-4">
            {riddle.input_labels.map((label, index) => (
              <div key={index}>
                <Label htmlFor={`riddle-${riddle.id}-input-${index}`} className="text-foreground mb-2 block">
                  {label}
                </Label>
                <Input
                  id={`riddle-${riddle.id}-input-${index}`}
                  type="number"
                  placeholder="0"
                  value={values[index] || ""}
                  onChange={(e) => onChange(riddle.id, index, e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-primary focus:border-primary"
                />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <Label htmlFor={`riddle-${riddle.id}-input-0`} className="text-foreground mb-2 block">
              Tu Respuesta
            </Label>
            <Input
              id={`riddle-${riddle.id}-input-0`}
              type="number"
              placeholder="Ingresa tu respuesta"
              value={values[0] || ""}
              onChange={(e) => onChange(riddle.id, 0, e.target.value)}
              className="bg-input border-border text-foreground focus:ring-primary focus:border-primary"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
