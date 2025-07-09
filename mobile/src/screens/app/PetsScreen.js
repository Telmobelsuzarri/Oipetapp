import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image
} from 'react-native';
import { Card, FAB, Avatar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { theme } from '../../theme';
import api from '../../services/api';

export default function PetsScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    try {
      const response = await api.get('/pets');
      setPets(response.data);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function getAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    if (age === 0) {
      const months = today.getMonth() - birth.getMonth() + 12;
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    }
    
    return `${age} ${age === 1 ? 'ano' : 'anos'}`;
  }

  function getSpeciesIcon(species) {
    const icons = {
      dog: 'dog',
      cat: 'cat',
      bird: 'bird',
      rabbit: 'rabbit',
      other: 'paw'
    };
    return icons[species] || 'paw';
  }

  function getActivityLevelLabel(level) {
    const labels = {
      sedentary: 'Sedentário',
      moderate: 'Moderado',
      active: 'Ativo',
      'very-active': 'Muito Ativo'
    };
    return labels[level] || level;
  }

  function renderPetCard(pet) {
    return (
      <TouchableOpacity
        key={pet._id}
        onPress={() => navigation.navigate('PetDetail', { petId: pet._id })}
      >
        <Card style={styles.petCard}>
          <View style={styles.petHeader}>
            <Avatar.Icon
              size={80}
              icon={getSpeciesIcon(pet.species)}
              style={{ backgroundColor: colors.pet[pet.species] || colors.primary }}
            />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed || pet.species}</Text>
              <View style={styles.petStats}>
                <View style={styles.statItem}>
                  <Icon name="cake-variant" size={16} color={colors.text.secondary} />
                  <Text style={styles.statText}>{getAge(pet.birthDate)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="weight" size={16} color={colors.text.secondary} />
                  <Text style={styles.statText}>{pet.weight}{pet.weightUnit}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.petDetails}>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: colors.primary + '20' }]}
              textStyle={{ color: colors.primary, fontSize: 12 }}
            >
              {getActivityLevelLabel(pet.activityLevel)}
            </Chip>

            {pet.healthConditions?.length > 0 && (
              <Chip
                mode="flat"
                style={[styles.chip, { backgroundColor: colors.warning + '20' }]}
                textStyle={{ color: colors.warning, fontSize: 12 }}
                icon="medical-bag"
              >
                {pet.healthConditions.length} condição(ões)
              </Chip>
            )}

            {pet.targetWeight && (
              <Chip
                mode="flat"
                style={[styles.chip, { backgroundColor: colors.info + '20' }]}
                textStyle={{ color: colors.info, fontSize: 12 }}
                icon="target"
              >
                Meta: {pet.targetWeight}{pet.weightUnit}
              </Chip>
            )}
          </View>

          <View style={styles.nutritionGoals}>
            <Text style={styles.goalTitle}>Meta Nutricional Diária</Text>
            <View style={styles.goalRow}>
              <View style={styles.goalItem}>
                <Icon name="fire" size={20} color={colors.nutrition.protein} />
                <Text style={styles.goalValue}>{pet.nutritionalGoals?.dailyCalories || 0}</Text>
                <Text style={styles.goalLabel}>kcal</Text>
              </View>
              <View style={styles.goalDivider} />
              <View style={styles.goalItem}>
                <View style={[styles.macroDot, { backgroundColor: colors.nutrition.protein }]} />
                <Text style={styles.goalValue}>{pet.nutritionalGoals?.proteinPercentage || 0}%</Text>
                <Text style={styles.goalLabel}>Proteína</Text>
              </View>
              <View style={styles.goalDivider} />
              <View style={styles.goalItem}>
                <View style={[styles.macroDot, { backgroundColor: colors.nutrition.fat }]} />
                <Text style={styles.goalValue}>{pet.nutritionalGoals?.fatPercentage || 0}%</Text>
                <Text style={styles.goalLabel}>Gordura</Text>
              </View>
              <View style={styles.goalDivider} />
              <View style={styles.goalItem}>
                <View style={[styles.macroDot, { backgroundColor: colors.nutrition.carbs }]} />
                <Text style={styles.goalValue}>{pet.nutritionalGoals?.carbPercentage || 0}%</Text>
                <Text style={styles.goalLabel}>Carbos</Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="paw" size={48} color={colors.primary} />
        <Text style={styles.loadingText}>Carregando seus pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadPets} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {pets.length > 0 ? (
          pets.map(renderPetCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="paw-off" size={80} color={colors.text.secondary} />
            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptyText}>
              Adicione seu primeiro pet para começar a acompanhar sua nutrição
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddPet')}
            >
              <Icon name="plus" size={20} color={colors.text.white} />
              <Text style={styles.addButtonText}>Adicionar Pet</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddPet')}
        color={colors.text.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: colors.text.secondary,
  },
  petCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  petHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  petInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  petBreed: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'capitalize',
  },
  petStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  petDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  chip: {
    height: 28,
  },
  nutritionGoals: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  goalItem: {
    alignItems: 'center',
    flex: 1,
  },
  goalDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.surface,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: theme.spacing.xs,
  },
  goalLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  macroDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    color: colors.text.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});