/**
 * OiPet Mock Data - Dados de demonstração para apresentação
 * 10 pets cadastrados com informações completas
 */

const mockPets = [
    {
        id: 1,
        name: "Max",
        type: "dog",
        breed: "Golden Retriever",
        age: 3,
        weight: 25,
        owner: "João Silva",
        avatar: "🐕",
        healthScore: 95,
        lastMeal: "2025-07-06 12:30",
        mealsToday: 3,
        caloriesConsumed: 850,
        caloriesTarget: 900,
        allergies: [],
        medications: [],
        vaccinated: true,
        registeredDate: "2024-01-15"
    },
    {
        id: 2,
        name: "Luna",
        type: "cat",
        breed: "Siamês",
        age: 2,
        weight: 4,
        owner: "Maria Santos",
        avatar: "🐱",
        healthScore: 98,
        lastMeal: "2025-07-06 13:00",
        mealsToday: 4,
        caloriesConsumed: 280,
        caloriesTarget: 300,
        allergies: ["lactose"],
        medications: [],
        vaccinated: true,
        registeredDate: "2024-02-20"
    },
    {
        id: 3,
        name: "Thor",
        type: "dog",
        breed: "Husky Siberiano",
        age: 4,
        weight: 28,
        owner: "Pedro Costa",
        avatar: "🐺",
        healthScore: 92,
        lastMeal: "2025-07-06 11:45",
        mealsToday: 2,
        caloriesConsumed: 750,
        caloriesTarget: 950,
        allergies: [],
        medications: ["vitamina D"],
        vaccinated: true,
        registeredDate: "2023-11-10"
    },
    {
        id: 4,
        name: "Mel",
        type: "cat",
        breed: "Persa",
        age: 1,
        weight: 3.5,
        owner: "Ana Oliveira",
        avatar: "🐈",
        healthScore: 96,
        lastMeal: "2025-07-06 14:15",
        mealsToday: 5,
        caloriesConsumed: 250,
        caloriesTarget: 250,
        allergies: ["frango"],
        medications: [],
        vaccinated: true,
        registeredDate: "2024-06-05"
    },
    {
        id: 5,
        name: "Rex",
        type: "dog",
        breed: "Pastor Alemão",
        age: 5,
        weight: 32,
        owner: "Carlos Mendes",
        avatar: "🦮",
        healthScore: 89,
        lastMeal: "2025-07-06 12:00",
        mealsToday: 2,
        caloriesConsumed: 800,
        caloriesTarget: 1000,
        allergies: [],
        medications: ["anti-inflamatório"],
        vaccinated: true,
        registeredDate: "2023-08-22"
    },
    {
        id: 6,
        name: "Nina",
        type: "cat",
        breed: "Maine Coon",
        age: 3,
        weight: 6,
        owner: "Beatriz Lima",
        avatar: "🐅",
        healthScore: 94,
        lastMeal: "2025-07-06 13:30",
        mealsToday: 3,
        caloriesConsumed: 320,
        caloriesTarget: 350,
        allergies: [],
        medications: [],
        vaccinated: true,
        registeredDate: "2024-03-18"
    },
    {
        id: 7,
        name: "Bob",
        type: "dog",
        breed: "Bulldog Francês",
        age: 2,
        weight: 12,
        owner: "Lucas Ferreira",
        avatar: "🐶",
        healthScore: 91,
        lastMeal: "2025-07-06 14:00",
        mealsToday: 3,
        caloriesConsumed: 450,
        caloriesTarget: 500,
        allergies: ["milho"],
        medications: [],
        vaccinated: true,
        registeredDate: "2024-04-12"
    },
    {
        id: 8,
        name: "Mia",
        type: "cat",
        breed: "Ragdoll",
        age: 4,
        weight: 5,
        owner: "Fernanda Alves",
        avatar: "🐱",
        healthScore: 97,
        lastMeal: "2025-07-06 13:45",
        mealsToday: 4,
        caloriesConsumed: 290,
        caloriesTarget: 300,
        allergies: [],
        medications: [],
        vaccinated: true,
        registeredDate: "2023-12-01"
    },
    {
        id: 9,
        name: "Zeus",
        type: "dog",
        breed: "Rottweiler",
        age: 6,
        weight: 40,
        owner: "Ricardo Santos",
        avatar: "🐕‍🦺",
        healthScore: 88,
        lastMeal: "2025-07-06 11:30",
        mealsToday: 2,
        caloriesConsumed: 900,
        caloriesTarget: 1200,
        allergies: ["soja"],
        medications: ["condroitina"],
        vaccinated: true,
        registeredDate: "2023-07-15"
    },
    {
        id: 10,
        name: "Lola",
        type: "dog",
        breed: "Poodle",
        age: 3,
        weight: 8,
        owner: "Juliana Rocha",
        avatar: "🐩",
        healthScore: 93,
        lastMeal: "2025-07-06 12:45",
        mealsToday: 3,
        caloriesConsumed: 380,
        caloriesTarget: 400,
        allergies: [],
        medications: [],
        vaccinated: true,
        registeredDate: "2024-01-28"
    }
];

// Dados de alimentação dos últimos 30 dias
const mockFeedingHistory = [
    // Últimos 30 dias de dados para análise
    { date: "2025-06-07", totalMeals: 28, pets: 8 },
    { date: "2025-06-08", totalMeals: 32, pets: 9 },
    { date: "2025-06-09", totalMeals: 30, pets: 9 },
    { date: "2025-06-10", totalMeals: 35, pets: 10 },
    { date: "2025-06-11", totalMeals: 33, pets: 10 },
    { date: "2025-06-12", totalMeals: 31, pets: 9 },
    { date: "2025-06-13", totalMeals: 34, pets: 10 },
    { date: "2025-06-14", totalMeals: 36, pets: 10 },
    { date: "2025-06-15", totalMeals: 38, pets: 10 },
    { date: "2025-06-16", totalMeals: 35, pets: 10 },
    { date: "2025-06-17", totalMeals: 37, pets: 10 },
    { date: "2025-06-18", totalMeals: 39, pets: 10 },
    { date: "2025-06-19", totalMeals: 36, pets: 10 },
    { date: "2025-06-20", totalMeals: 40, pets: 10 },
    { date: "2025-06-21", totalMeals: 38, pets: 10 },
    { date: "2025-06-22", totalMeals: 42, pets: 10 },
    { date: "2025-06-23", totalMeals: 41, pets: 10 },
    { date: "2025-06-24", totalMeals: 39, pets: 10 },
    { date: "2025-06-25", totalMeals: 43, pets: 10 },
    { date: "2025-06-26", totalMeals: 45, pets: 10 },
    { date: "2025-06-27", totalMeals: 42, pets: 10 },
    { date: "2025-06-28", totalMeals: 44, pets: 10 },
    { date: "2025-06-29", totalMeals: 46, pets: 10 },
    { date: "2025-06-30", totalMeals: 45, pets: 10 },
    { date: "2025-07-01", totalMeals: 48, pets: 10 },
    { date: "2025-07-02", totalMeals: 47, pets: 10 },
    { date: "2025-07-03", totalMeals: 49, pets: 10 },
    { date: "2025-07-04", totalMeals: 50, pets: 10 },
    { date: "2025-07-05", totalMeals: 48, pets: 10 },
    { date: "2025-07-06", totalMeals: 34, pets: 10 }
];

// Produtos escaneados
const mockScannedProducts = [
    { id: 1, name: "Ração Premium Cães Adultos", brand: "PetLife", scans: 145, rating: 4.8 },
    { id: 2, name: "Ração Gatos Castrados", brand: "NutriCat", scans: 98, rating: 4.6 },
    { id: 3, name: "Petisco Natural", brand: "OiPet", scans: 234, rating: 4.9 },
    { id: 4, name: "Ração Filhotes", brand: "PuppyGrow", scans: 67, rating: 4.7 },
    { id: 5, name: "Sachê Gourmet Gatos", brand: "FelixPremium", scans: 189, rating: 4.5 }
];

// Estatísticas gerais
const mockStats = {
    totalUsers: 1234,
    totalPets: 2567,
    totalFeedings: 45678,
    totalScans: 3456,
    engagementRate: 87.3,
    monthlyRevenue: 23400,
    dailyActiveUsers: 892,
    averageMealsPerPet: 3.4,
    healthScoreAverage: 93.2,
    vaccinationRate: 100
};

// Função para calcular métricas
function calculateMetrics() {
    const totalPets = mockPets.length;
    const totalMealsToday = mockPets.reduce((sum, pet) => sum + pet.mealsToday, 0);
    const averageHealthScore = mockPets.reduce((sum, pet) => sum + pet.healthScore, 0) / totalPets;
    const dogsCount = mockPets.filter(pet => pet.type === 'dog').length;
    const catsCount = mockPets.filter(pet => pet.type === 'cat').length;
    
    return {
        totalPets,
        totalMealsToday,
        averageHealthScore: averageHealthScore.toFixed(1),
        dogsCount,
        catsCount,
        dogsPercentage: ((dogsCount / totalPets) * 100).toFixed(0),
        catsPercentage: ((catsCount / totalPets) * 100).toFixed(0)
    };
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.OiPetData = {
        pets: mockPets,
        feedingHistory: mockFeedingHistory,
        scannedProducts: mockScannedProducts,
        stats: mockStats,
        metrics: calculateMetrics()
    };
}

// Export para Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockPets,
        mockFeedingHistory,
        mockScannedProducts,
        mockStats,
        calculateMetrics
    };
}