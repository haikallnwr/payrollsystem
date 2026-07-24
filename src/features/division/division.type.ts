export interface Division {
  id: number;
  name: string;
  description: string | null;
}

export interface DivisionCreateInput {
  name: string;
  description?: string;
}

export interface DivisionUpdateInput {
  name?: string;
  description?: string;
}
