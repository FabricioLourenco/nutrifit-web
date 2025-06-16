// components/mockPacientes.ts

export const mockPacientes = [
  {
    id: 1,
    nome: "João da Silva",
    idade: 30,
    altura: 1.75,
    peso: 80,
    objetivo: "Perda de peso",
    dieta: [
      {
        descricao: "Café da manhã",
        tipo: "Café da manhã",
        alimentos: "Ovos, pão integral e café",
        kcal: 350,
        carbo: 30,
        proteina: 20,
        peso: 300,
      },
    ],
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    idade: 25,
    altura: 1.65,
    peso: 60,
    objetivo: "Ganho de massa",
    dieta: [
      {
        descricao: "Almoço",
        tipo: "Almoço",
        alimentos: "Arroz, feijão, carne magra e legumes",
        kcal: 600,
        carbo: 70,
        proteina: 35,
        peso: 450,
      },
    ],
  },
];
