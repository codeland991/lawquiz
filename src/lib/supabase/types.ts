export type Post = {
  id: string;
  title: string;
  content: string;
  views: number;
  created_at: string;
};

export type WrongNote = {
  id: string;
  round_id: string;
  round_label: string;
  law: string;
  article_no: string;
  article_title: string;
  statement: string;
  user_answer: "O" | "X";
  correct_answer: "O" | "X";
  correct_text: string;
  created_at: string;
};
