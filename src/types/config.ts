export interface Riddle {
  id: number;
  title: string;
  description: string;
  type: string;
  correct_answer: number;
  image_url?: string;
  input_labels?: string[];
}

export interface Config {
  page_title: string;
  welcome_message: string;
  riddles: Riddle[];
  success_message: string;
  error_message: string;
  verify_button_text: string;
}
